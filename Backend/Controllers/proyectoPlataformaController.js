const { ProyectoPlataforma } = require('../Models');

exports.getAll = async (req, res) => {
  try {
    const data = await ProyectoPlataforma.findAll();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await ProyectoPlataforma.findByPk(req.params.id);
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
    const data = await ProyectoPlataforma.create(safeData);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    // Prevención de Mass Assignment
    const { id, estado, rol, contrasena, ...safeData } = req.body;
    const [updated] = await ProyectoPlataforma.update(safeData, { where: { id_proyecto: req.params.id } });
    if (!updated) return res.status(404).json({ success: false, message: 'No encontrado' });
    const data = await ProyectoPlataforma.findByPk(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await ProyectoPlataforma.destroy({ where: { id_proyecto: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.status(200).json({ success: true, message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
