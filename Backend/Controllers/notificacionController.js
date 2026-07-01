const { Notificacion } = require('../Models');

exports.getAll = async (req, res) => {
  try {
    const data = await Notificacion.findAll();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMisNotificaciones = async (req, res) => {
  try {
    const limite = Math.min(Number.parseInt(req.query.limit, 10) || 10, 50);
    const where = { id_usuario: req.user.id_usuario };
    const [data, unreadCount] = await Promise.all([
      Notificacion.findAll({
        where,
        order: [['fecha', 'DESC']],
        limit: limite
      }),
      Notificacion.count({ where: { ...where, leido: false } })
    ]);
    res.status(200).json({ success: true, data, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Notificacion.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    // Prevención de Mass Assignment
    const { id, estado, rol, contrasena, ...safeData } = req.body;
    const data = await Notificacion.create(safeData);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    // Prevención de Mass Assignment
    const { id, estado, rol, contrasena, ...safeData } = req.body;
    const where = { id_notificacion: req.params.id };
    if (req.user) where.id_usuario = req.user.id_usuario;

    const [updated] = await Notificacion.update(safeData, { where });
    if (!updated) return res.status(404).json({ success: false, message: 'No encontrado' });
    const data = await Notificacion.findByPk(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.markMineAsRead = async (req, res) => {
  try {
    await Notificacion.update(
      { leido: true },
      { where: { id_usuario: req.user.id_usuario, leido: false } }
    );

    res.status(200).json({ success: true, unreadCount: 0 });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Notificacion.destroy({ where: { id_notificacion: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.status(200).json({ success: true, message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
