const { Mensaje, MensajeHistorial, Usuario } = require('../Models');

const includeHistorial = [{
  model: MensajeHistorial,
  as: 'historial',
  include: [{ model: Usuario, as: 'responsable', attributes: ['id_usuario', 'nombre', 'rol'], required: false }],
  separate: true,
  order: [['fecha', 'ASC']],
}];

const puedeModificar = (mensaje, usuario) => usuario?.rol === 'ADMIN'
  || Number(mensaje.id_usuario_emisor) === Number(usuario?.id_usuario);

exports.getAll = async (req, res) => {
  try {
    const where = {};
    if (req.query.id_conversacion) where.id_conversacion = req.query.id_conversacion;
    const data = await Mensaje.findAll({ where, include: includeHistorial, order: [['fecha_envio', 'ASC']] });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Mensaje.findByPk(req.params.id, { include: includeHistorial });
    if (!data) return res.status(404).json({ success: false, message: 'Mensaje no encontrado' });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const contenido = String(req.body.contenido || '').trim();
    if (!contenido && !req.body.archivo_url) {
      return res.status(400).json({ success: false, message: 'El mensaje o archivo es requerido' });
    }
    const data = await Mensaje.create({
      id_conversacion: req.body.id_conversacion,
      id_usuario_emisor: req.user.id_usuario,
      contenido,
      archivo_url: req.body.archivo_url || null,
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  const transaction = await Mensaje.sequelize.transaction();
  try {
    const mensaje = await Mensaje.findByPk(req.params.id, { transaction });
    if (!mensaje) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Mensaje no encontrado' });
    }
    if (!puedeModificar(mensaje, req.user)) {
      await transaction.rollback();
      return res.status(403).json({ success: false, message: 'No puedes editar este mensaje' });
    }
    if (mensaje.fecha_eliminacion) {
      await transaction.rollback();
      return res.status(409).json({ success: false, message: 'Un mensaje eliminado no puede editarse' });
    }

    const contenidoNuevo = String(req.body.contenido || '').trim();
    if (!contenidoNuevo) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'El contenido es requerido' });
    }
    const contenidoAnterior = mensaje.contenido;
    await MensajeHistorial.create({
      id_mensaje: mensaje.id_mensaje,
      id_usuario: req.user.id_usuario,
      accion: 'EDICION',
      contenido_anterior: contenidoAnterior,
      contenido_nuevo: contenidoNuevo,
    }, { transaction });
    await mensaje.update({ contenido: contenidoNuevo, fecha_edicion: new Date(), editado_por: req.user.id_usuario }, { transaction });
    await transaction.commit();
    res.status(200).json({ success: true, data: await Mensaje.findByPk(mensaje.id_mensaje, { include: includeHistorial }) });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  const transaction = await Mensaje.sequelize.transaction();
  try {
    const mensaje = await Mensaje.findByPk(req.params.id, { transaction });
    if (!mensaje) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Mensaje no encontrado' });
    }
    if (!puedeModificar(mensaje, req.user)) {
      await transaction.rollback();
      return res.status(403).json({ success: false, message: 'No puedes eliminar este mensaje' });
    }
    const motivo = String(req.body.motivo_eliminacion || '').trim();
    if (req.user.rol === 'ADMIN' && !motivo) {
      await transaction.rollback();
      return res.status(400).json({ success: false, message: 'El motivo es requerido para eliminaciones administrativas' });
    }

    await MensajeHistorial.create({
      id_mensaje: mensaje.id_mensaje,
      id_usuario: req.user.id_usuario,
      accion: 'ELIMINACION',
      contenido_anterior: mensaje.contenido,
      motivo: motivo || 'Eliminado por el autor',
    }, { transaction });
    await mensaje.update({
      fecha_eliminacion: new Date(),
      eliminado_por: req.user.id_usuario,
      motivo_eliminacion: motivo || 'Eliminado por el autor',
    }, { transaction });
    await transaction.commit();
    res.status(200).json({ success: true, message: 'Mensaje eliminado y conservado para auditoría' });
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    res.status(500).json({ success: false, message: error.message });
  }
};
