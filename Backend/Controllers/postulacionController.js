const { Postulacion, PerfilEstudiante } = require('../Models');

exports.getAll = async (req, res) => {
  try {
    const data = await Postulacion.findAll();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Postulacion.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const perfil = await PerfilEstudiante.findOne({ where: { id_usuario: req.user.id_usuario } });
    if (!perfil) return res.status(400).json({ success: false, message: 'Perfil de estudiante no encontrado.' });

    const { id_propuesta, mensaje_presentacion, presupuesto_max, desglose_tareas, tarifa_hora } = req.body;

    // Si viene desglose, recalcular en el backend para evitar manipulación del cliente
    let total_horas = req.body.total_horas || null;
    let subtotal    = req.body.subtotal    || null;
    let iva         = req.body.iva         || null;
    let total       = req.body.total       || null;

    if (Array.isArray(desglose_tareas) && desglose_tareas.length > 0 && tarifa_hora) {
      const tarifa = Number(tarifa_hora);
      total_horas  = desglose_tareas.reduce((sum, t) => sum + (Number(t.horas) || 0), 0);
      subtotal     = parseFloat((total_horas * tarifa).toFixed(2));
      iva          = parseFloat((subtotal * 0.13).toFixed(2));
      total        = parseFloat((subtotal + iva).toFixed(2));
    }

    const data = await Postulacion.create({
      id_propuesta,
      id_perfil_estudiante: perfil.id_perfil_estudiante,
      mensaje_presentacion: mensaje_presentacion || null,
      presupuesto_max:      presupuesto_max      || null,
      desglose_tareas:      desglose_tareas      || null,
      tarifa_hora:          tarifa_hora          || null,
      total_horas,
      subtotal,
      iva,
      total,
    });

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
    const { desglose_tareas, tarifa_hora } = req.body;
    const campos = { ...req.body };

    if (Array.isArray(desglose_tareas) && desglose_tareas.length > 0 && tarifa_hora) {
      const tarifa         = Number(tarifa_hora);
      campos.total_horas   = desglose_tareas.reduce((sum, t) => sum + (Number(t.horas) || 0), 0);
      campos.subtotal      = parseFloat((campos.total_horas * tarifa).toFixed(2));
      campos.iva           = parseFloat((campos.subtotal * 0.13).toFixed(2));
      campos.total         = parseFloat((campos.subtotal + campos.iva).toFixed(2));
    }

    const [updated] = await Postulacion.update(campos, { where: { id_postulacion: req.params.id } });
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
