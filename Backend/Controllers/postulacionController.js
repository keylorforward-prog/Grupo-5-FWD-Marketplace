const { Postulacion, PerfilEstudiante, Propuesta, PerfilEmpresario, Notificacion } = require('../Models');
const { Op } = require('sequelize');


const DOS_MINUTOS = 2 * 60 * 1000;

const actualizarPendiente = async (postulacion) => {
  if (postulacion.estado === 'ENVIADA' && Date.now() - new Date(postulacion.fecha_postulacion).getTime() >= DOS_MINUTOS) {
    postulacion.estado = 'PENDIENTE';
    await postulacion.save();
  }
};

exports.getAll = async (req, res) => {
  try {
    const data = await Postulacion.findAll();
    await Promise.all(data.map(actualizarPendiente));
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Postulacion.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'No encontrado' });
    await actualizarPendiente(data);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const perfil = await PerfilEstudiante.findOne({ where: { id_usuario: req.user.id_usuario } });
    if (!perfil) return res.status(400).json({ success: false, message: 'Perfil de estudiante no encontrado.' });

    const data = await Postulacion.create({
      id_propuesta: req.body.id_propuesta,
      id_perfil_estudiante: perfil.id_perfil_estudiante,
      mensaje_presentacion: req.body.mensaje_presentacion || null,
      presupuesto_max: req.body.presupuesto_max || null,
    });

    // Check notification preferences
    const propuesta = await Propuesta.findByPk(req.body.id_propuesta);
    if (propuesta) {
      const perfilEmpresario = await PerfilEmpresario.findByPk(propuesta.id_perfil_empresario);
      if (perfilEmpresario && perfilEmpresario.notif_postulaciones) {
        await Notificacion.create({
          id_usuario: perfilEmpresario.id_usuario,
          tipo: 'NUEVA_POSTULACION',
          mensaje: `Un estudiante se ha postulado a tu propuesta.`,
          leido: false,
          fecha: new Date(),
        });
      }
    }

    res.status(201).json({ success: true, data });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'Ya te postulaste a este proyecto.' });
    }
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Postulacion.update(req.body, { where: { id_postulacion: req.params.id } });
    if (!updated) return res.status(404).json({ success: false, message: 'No encontrado' });
    const data = await Postulacion.findByPk(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Postulacion.destroy({ where: { id_postulacion: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.status(200).json({ success: true, message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
