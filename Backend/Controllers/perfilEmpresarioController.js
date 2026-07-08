const { PerfilEmpresario, Usuario, CodigoRecuperacion } = require('../Models');
const bcrypt = require('bcryptjs');
const { sendRecoveryEmail } = require('../Services/emailService');

const generateRecoveryCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.getAll = async (req, res) => {
  try {
    const data = await PerfilEmpresario.findAll();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await PerfilEmpresario.findByPk(req.params.id);
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
    const data = await PerfilEmpresario.create(safeData);
    res.status(201).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    // Prevención de Mass Assignment
    const { id, estado, rol, contrasena, ...safeData } = req.body;
    const [updated] = await PerfilEmpresario.update(safeData, { where: { id_perfil_empresario: req.params.id } });
    if (!updated) return res.status(404).json({ success: false, message: 'No encontrado' });
    const data = await PerfilEmpresario.findByPk(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await PerfilEmpresario.destroy({ where: { id_perfil_empresario: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: 'No encontrado' });
    res.status(200).json({ success: true, message: 'Eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProfileByUserId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id_usuario);
    if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    const perfil = await PerfilEmpresario.findOne({ where: { id_usuario: req.params.id_usuario } });
    
    // Devolvemos la estructura combinada para el frontend
    res.status(200).json({ 
      success: true, 
      data: {
        nombre_empresa: perfil?.nombre_empresa || '',
        nombre: usuario.nombre,
        cedula: usuario.cedula,
        telefono_whatsapp: usuario.telefono_whatsapp || perfil?.telefono_whatsapp || '',
        sitio_web: perfil?.sitio_web || '',
        sector: perfil?.sector || '',
        descripcion: perfil?.descripcion || '',
        notif_postulaciones: perfil?.notif_postulaciones ?? true,
        notif_resumen_semanal: perfil?.notif_resumen_semanal ?? true,
        notif_mensajes_directos: perfil?.notif_mensajes_directos ?? true,
        cedula_juridica_archivo: perfil?.cedula_juridica_archivo || null
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateProfileByUserId = async (req, res) => {
  try {
    const { 
      nombre_empresa, nombre, cedula, telefono_whatsapp, sitio_web, sector, descripcion,
      notif_postulaciones, notif_resumen_semanal, notif_mensajes_directos 
    } = req.body;
    const id_usuario = req.params.id_usuario;

    // Actualizamos Usuario
    await Usuario.update({ nombre, cedula, telefono_whatsapp }, { where: { id_usuario } });

    // Preparamos objeto de actualización para PerfilEmpresario
    const updateData = { nombre_empresa, sitio_web, sector, descripcion, telefono_whatsapp };
    if (notif_postulaciones !== undefined) updateData.notif_postulaciones = notif_postulaciones;
    if (notif_resumen_semanal !== undefined) updateData.notif_resumen_semanal = notif_resumen_semanal;
    if (notif_mensajes_directos !== undefined) updateData.notif_mensajes_directos = notif_mensajes_directos;

    // Actualizamos PerfilEmpresario
    await PerfilEmpresario.update(updateData, { where: { id_usuario } });

    res.status(200).json({ success: true, message: 'Perfil de empresa actualizado correctamente' });
  } catch (error) {
    console.error("Error en updateProfileByUserId:", error);
    let errorMessage = error.message;
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      errorMessage = error.errors.map(e => e.message).join(', ');
    }
    res.status(500).json({ success: false, message: errorMessage, raw: error });
  }
};

exports.requestPasswordChange = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { currentPassword } = req.body;

    if (!currentPassword) {
      return res.status(400).json({ success: false, message: 'La contraseña actual es requerida' });
    }

    const user = await Usuario.findByPk(id_usuario);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // Verificar la contraseña actual
    const isPasswordValid = await bcrypt.compare(currentPassword, user.contrasena_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'La contraseña actual es incorrecta' });
    }

    // Invalidar códigos activos anteriores
    await CodigoRecuperacion.update(
      { estado: 'EXPIRADO' },
      { where: { id_usuario: user.id_usuario, estado: 'ACTIVO' } }
    );

    // Generar código
    const recoveryCode = generateRecoveryCode();

    // Guardar código
    await CodigoRecuperacion.create({
      id_usuario: user.id_usuario,
      codigo: recoveryCode,
      estado: 'ACTIVO',
    });

    // Enviar código por correo
    await sendRecoveryEmail({
      userName: user.nombre,
      email: user.correo,
      recoveryCode,
    });

    return res.status(200).json({
      success: true,
      message: 'Código enviado al correo correctamente',
    });
  } catch (error) {
    console.error('Error en requestPasswordChange:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.confirmPasswordChange = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { currentPassword, newPassword, code } = req.body;

    if (!currentPassword || !newPassword || !code) {
      return res.status(400).json({ success: false, message: 'Faltan datos requeridos (contraseña actual, nueva, o código)' });
    }

    const user = await Usuario.findByPk(id_usuario);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.contrasena_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'La contraseña actual es incorrecta' });
    }

    // Verificar el código
    const recoveryRecord = await CodigoRecuperacion.findOne({
      where: {
        id_usuario: user.id_usuario,
        codigo: code,
        estado: 'ACTIVO',
      },
    });

    if (!recoveryRecord) {
      return res.status(400).json({ success: false, message: 'Código inválido o expirado' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash(newPassword, salt);

    // Update password
    await user.update({ contrasena_hash: newPasswordHash });

    // Invalidate code
    await recoveryRecord.update({ estado: 'USADO' });

    return res.status(200).json({ success: true, message: 'Contraseña actualizada exitosamente' });
  } catch (error) {
    console.error('Error en confirmPasswordChange:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};
