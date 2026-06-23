const { ConversacionIA } = require('../Models');

exports.create = async (req, res) => {
  try {
    const { id_perfil_empresario, historial } = req.body;
    const data = await ConversacionIA.create({
      id_perfil_empresario,
      historial: JSON.stringify(historial),
      estado: 'en_progreso',
      fecha_inicio: new Date(),
      fecha_actualizacion: new Date(),
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { historial, estado } = req.body;
    const updateData = { fecha_actualizacion: new Date() };
    if (historial !== undefined) updateData.historial = JSON.stringify(historial);
    if (estado !== undefined) updateData.estado = estado;

    const [updated] = await ConversacionIA.update(updateData, {
      where: { id_conversacion_ia: req.params.id },
    });
    if (!updated) return res.status(404).json({ success: false, message: 'No encontrado' });

    const data = await ConversacionIA.findByPk(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await ConversacionIA.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getActiveByEmpresario = async (req, res) => {
  try {
    const data = await ConversacionIA.findOne({
      where: { id_perfil_empresario: req.params.id, estado: 'en_progreso' },
      order: [['fecha_actualizacion', 'DESC']],
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllByEmpresario = async (req, res) => {
  try {
    const data = await ConversacionIA.findAll({
      where: { id_perfil_empresario: req.params.id },
      order: [['fecha_actualizacion', 'DESC']],
    });
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await ConversacionIA.destroy({
      where: { id_conversacion_ia: req.params.id },
    });
    if (!deleted) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.json({ success: true, message: 'Conversación eliminada' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

