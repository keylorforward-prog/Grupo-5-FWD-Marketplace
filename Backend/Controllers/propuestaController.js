const { Propuesta, PerfilEmpresario, Usuario } = require('../Models');

exports.getAll = async (req, res) => {
  try {
    const data = await Propuesta.findAll({
      include: [{
        model: PerfilEmpresario,
        as: 'perfilEmpresario',
        include: [{ model: Usuario, as: 'usuario', attributes: { exclude: ['contrasena_hash'] } }]
      }]
    });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { Propuesta, PerfilEmpresario, Usuario } = require('../Models');
    const data = await Propuesta.findByPk(req.params.id, {
      include: [{
        model: PerfilEmpresario,
        as: 'perfilEmpresario',
        include: [{ model: Usuario, as: 'usuario', attributes: { exclude: ['contrasena_hash'] } }]
      }]
    });
    if (!data) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await Propuesta.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Propuesta.update(req.body, { where: { id_propuesta: req.params.id } });
    if (!updated) return res.status(404).json({ success: false, message: 'No encontrado' });
    const data = await Propuesta.findByPk(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Propuesta.destroy({ where: { id_propuesta: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.status(200).json({ success: true, message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
