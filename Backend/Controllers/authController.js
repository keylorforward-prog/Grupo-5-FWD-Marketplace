const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Usuario, PerfilEstudiante, PerfilEmpresario } = require('../Models');
const config = require('../Config/config');
const { uploadFileToS3 } = require('../Config/aws');

// ── Helpers ──────────────────────────────────────────────────────────────────

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id_usuario, email: user.correo, rol: user.rol },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en ms
};

// ── Controladores ─────────────────────────────────────────────────────────────

const register = async (req, res) => {
  try {
    const { nombre, email, password, cedula, rol, telefono_whatsapp, titulo_fwd, tipo_empresa, sector } = req.body;

    if (!nombre || !email || !password || !cedula || !rol) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos: nombre, email, password, cedula, rol',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    const existingUser = await Usuario.findOne({ where: { correo: email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una cuenta con ese email',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Usuario.create({ 
      nombre, 
      correo: email, 
      contrasena_hash: hashedPassword, 
      cedula, 
      rol,
      telefono_whatsapp,
      tipo_empresa: rol === 'EMPRESARIO' ? tipo_empresa : null,
      perfil_completo: true
    });

    let finalTituloFwd = titulo_fwd || 'Estudiante FWD';
    let finalCedulaJuridicaUrl = null;
    
    if (req.files) {
      if (rol === 'ESTUDIANTE' && req.files['titulo_fwd_file'] && req.files['titulo_fwd_file'][0]) {
        finalTituloFwd = await uploadFileToS3(req.files['titulo_fwd_file'][0], 'titulos_fwd');
      }
      if (rol === 'EMPRESARIO' && req.files['cedula_juridica_file'] && req.files['cedula_juridica_file'][0]) {
        finalCedulaJuridicaUrl = await uploadFileToS3(req.files['cedula_juridica_file'][0], 'cedulas_juridicas');
      }
    }

    if (rol === 'ESTUDIANTE') {
      await PerfilEstudiante.create({
        id_usuario: newUser.id_usuario,
        titulo_fwd: finalTituloFwd,
        telefono_whatsapp
      });
    } else if (rol === 'EMPRESARIO') {
      await PerfilEmpresario.create({
        id_usuario: newUser.id_usuario,
        sector: sector || 'No especificado',
        telefono_whatsapp,
        cedula_juridica_archivo: finalCedulaJuridicaUrl
      });
    }
    
    return res.status(201).json({
      success: true,
      pendingApproval: true,
      message: '¡Cuenta creada exitosamente! Tu cuenta está pendiente de aprobación por un administrador. Te notificaremos cuando sea activada.',
    });
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos',
      });
    }

    const user = await Usuario.findOne({ where: { correo: email } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.contrasena_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas',
      });
    }

    // Verificar estado de la cuenta
    if (user.estado_cuenta === 'PENDIENTE') {
      return res.status(403).json({
        success: false,
        pendingApproval: true,
        message: 'Tu cuenta aún está pendiente de aprobación por un administrador.',
      });
    }
    if (user.estado_cuenta === 'SUSPENDIDA') {
      return res.status(403).json({
        success: false,
        message: 'Tu cuenta ha sido suspendida. Contacta al administrador.',
      });
    }

    // Actualizar último acceso
    await user.update({ ultimo_acceso: new Date() });

    const token = generateToken(user);

    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: '¡Bienvenido de vuelta!',
      token,
      user: {
        id: user.id_usuario,
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        email: user.correo,
        rol: user.rol,
        foto_perfil: user.foto_perfil,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email y contraseña son requeridos' });
    }

    const user = await Usuario.findOne({ where: { correo: email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    // Verificar explícitamente el rol
    if (user.rol !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Acceso denegado: rol de administrador requerido' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.contrasena_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
    }

    if (user.estado_cuenta === 'SUSPENDIDA') {
      return res.status(403).json({ success: false, message: 'Cuenta suspendida' });
    }

    await user.update({ ultimo_acceso: new Date() });
    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: '¡Bienvenido al panel de administración!',
      token,
      user: {
        id: user.id_usuario,
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        email: user.correo,
        rol: user.rol,
        foto_perfil: user.foto_perfil,
      },
    });
  } catch (error) {
    console.error('Error en adminLogin:', error);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

const logout = async (req, res) => {
  res.clearCookie('token', cookieOptions);
  return res.status(200).json({
    success: true,
    message: 'Sesión cerrada correctamente',
  });
};

const me = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user.id_usuario,
      id_usuario: req.user.id_usuario,
      nombre: req.user.nombre,
      email: req.user.correo,
      rol: req.user.rol,
      foto_perfil: req.user.foto_perfil,
      perfil_completo: req.user.perfil_completo,
      provider: req.user.provider,
      avatar_url: req.user.avatar_url
    },
  });
};

const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id_usuario; // From verifyToken middleware

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Ambas contraseñas son requeridas',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La nueva contraseña debe tener al menos 6 caracteres',
      });
    }

    const user = await Usuario.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.contrasena_hash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'La contraseña actual es incorrecta',
      });
    }

    // Hash new password and save
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.contrasena_hash = hashedPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente',
    });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

const completarPerfil = async (req, res) => {
  try {
    const { rol, cedula, telefono_whatsapp, tipo_empresa, sector } = req.body;
    const userId = req.user.id_usuario;

    if (!rol || !cedula) {
      return res.status(400).json({
        success: false,
        message: 'Rol y cédula son requeridos',
      });
    }

    const user = await Usuario.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Actualizar datos del usuario
    await user.update({
      rol,
      cedula,
      telefono_whatsapp,
      tipo_empresa: rol === 'EMPRESARIO' ? tipo_empresa : null,
      perfil_completo: true
    });

    let finalTituloFwd = 'Estudiante FWD';
    let finalCedulaJuridicaUrl = null;
    let fotoUrl = user.foto_perfil;
    
    if (req.files) {
      if (rol === 'ESTUDIANTE' && req.files['titulo_fwd_file'] && req.files['titulo_fwd_file'][0]) {
        finalTituloFwd = await uploadFileToS3(req.files['titulo_fwd_file'][0], 'titulos_fwd');
      }
      if (rol === 'EMPRESARIO' && req.files['cedula_juridica_file'] && req.files['cedula_juridica_file'][0]) {
        finalCedulaJuridicaUrl = await uploadFileToS3(req.files['cedula_juridica_file'][0], 'cedulas_juridicas');
      }
      if (req.files['foto_perfil_file'] && req.files['foto_perfil_file'][0]) {
        fotoUrl = await uploadFileToS3(req.files['foto_perfil_file'][0], 'fotos_perfil');
        await user.update({ foto_perfil: fotoUrl });
      }
    }

    // Crear perfil correspondiente
    if (rol === 'ESTUDIANTE') {
      await PerfilEstudiante.create({
        id_usuario: user.id_usuario,
        titulo_fwd: finalTituloFwd,
        telefono_whatsapp
      });
    } else if (rol === 'EMPRESARIO') {
      await PerfilEmpresario.create({
        id_usuario: user.id_usuario,
        sector: sector || 'No especificado',
        telefono_whatsapp,
        cedula_juridica_archivo: finalCedulaJuridicaUrl
      });
    }
    
    // Generar nuevo token con los datos actualizados
    const token = generateToken(user);
    res.cookie('token', token, cookieOptions);

    return res.status(200).json({
      success: true,
      message: 'Perfil completado exitosamente',
      token,
      user: {
        id: user.id_usuario,
        id_usuario: user.id_usuario,
        nombre: user.nombre,
        email: user.correo,
        rol: user.rol,
        foto_perfil: user.foto_perfil,
        perfil_completo: user.perfil_completo,
        provider: user.provider,
        avatar_url: user.avatar_url
      }
    });

  } catch (error) {
    console.error('Error en completarPerfil:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};

module.exports = { register, login, logout, me, updatePassword, completarPerfil };
