const { Usuario } = require('../Models');
const { uploadFileToS3 } = require('../Config/aws');

exports.getAll = async (req, res) => {
  try {
    const data = await Usuario.findAll();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Usuario.findByPk(req.params.id);
    if (!data) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const data = await Usuario.create(req.body);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Usuario.update(req.body, { where: { id_usuario: req.params.id } });
    if (!updated) return res.status(404).json({ success: false, message: 'No encontrado' });
    const data = await Usuario.findByPk(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Usuario.destroy({ where: { id_usuario: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.status(200).json({ success: true, message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.uploadFotoPerfil = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No se envió ningún archivo' });
    }
    
    // Subir a S3
    const fotoUrl = await uploadFileToS3(req.file, 'fotos_perfil');

    // Actualizar la base de datos
    const [updated] = await Usuario.update(
      { foto_perfil: fotoUrl },
      { where: { id_usuario: req.params.id } }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const data = await Usuario.findByPk(req.params.id);
    res.status(200).json({ success: true, data, url: fotoUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
