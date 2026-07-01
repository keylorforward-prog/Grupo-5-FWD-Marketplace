const { PerfilEstudiante } = require('../Models');

exports.getAll = async (req, res) => {
  try {
    const data = await PerfilEstudiante.findAll();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await PerfilEstudiante.findByPk(req.params.id);
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
    const data = await PerfilEstudiante.create(safeData);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    // Prevención de Mass Assignment
    const { id, estado, rol, contrasena, ...safeData } = req.body;
    const [updated] = await PerfilEstudiante.update(safeData, { where: { id_perfil_estudiante: req.params.id } });
    if (!updated) return res.status(404).json({ success: false, message: 'No encontrado' });
    const data = await PerfilEstudiante.findByPk(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await PerfilEstudiante.destroy({ where: { id_perfil_estudiante: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.status(200).json({ success: true, message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
