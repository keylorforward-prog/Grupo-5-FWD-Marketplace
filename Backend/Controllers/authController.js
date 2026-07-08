const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
<<<<<<< HEAD
const {Usuario,PerfilEstudiante,PerfilEmpresario,CodigoRecuperacion} = require('../Models');
=======
const { sequelize, Usuario, PerfilEstudiante, PerfilEmpresario, CodigoRecuperacion } = require('../Models');
>>>>>>> d484eb4090edbc13f882214eded7253e0543bf11
const config = require('../Config/config');
const { uploadFileToS3 } = require('../Config/aws');
const { sendRecoveryEmail } = require('../Services/emailService');
// ── Helpers ──────────────────────────────────────────────────────────────────

const generateToken = (user, customExpiresIn) => {
  return jwt.sign(
    { id: user.id_usuario, email: user.correo, rol: user.rol },
    config.jwt.secret,
    { expiresIn: customExpiresIn || config.jwt.expiresIn }
  );
};
const generateRecoveryCode = () => {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
};


const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días en ms
};

const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 2 * 60 * 60 * 1000, // 2 horas en ms
};

const TIPOS_EVIDENCIA_FWD = new Set([
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/webp'
]);

const obtenerArchivo = (req, campo) => req.files?.[campo]?.[0] || null;

const validarEvidenciaFwd = (archivo) => {
  if (!archivo) return 'Debes adjuntar tu titulo o certificado FWD en PDF o imagen.';
  if (!TIPOS_EVIDENCIA_FWD.has(archivo.mimetype)) {
    return 'La evidencia FWD debe ser PDF, PNG, JPG o WEBP.';
  }
  return null;
};

const esConflictoCedula = (error) => {
  const codigo = error?.original?.code || error?.parent?.code || error?.code;
  const restriccion = error?.original?.constraint || error?.parent?.constraint || error?.constraint;
  const campos = error?.fields || error?.parent?.fields || {};

  return codigo === '23505' && (
    restriccion === 'usuario_cedula_key1' ||
    restriccion === 'usuario_cedula_key' ||
    Object.prototype.hasOwnProperty.call(campos, 'cedula')
  );
};

const respuestaConflictoCedula = (res) => res.status(409).json({
  success: false,
  error: 'La cédula ingresada ya está registrada por otro usuario.',
  field: 'cedula',
  code: 'CEDULA_ALREADY_EXISTS',
});

<<<<<<< HEAD
=======
const ROLES_REGISTRO = new Set(['ESTUDIANTE', 'EMPRESARIO']);

const esErrorAlmacenamiento = (error) => {
  const metadata = error?.$metadata;
  const code = error?.Code || error?.name || error?.code;
  return Boolean(metadata?.httpStatusCode || code === 'InvalidAccessKeyId' || code === 'CredentialsProviderError');
};

const responderErrorAlmacenamiento = (res) => res.status(503).json({
  success: false,
  message: 'No se pudo almacenar el archivo requerido. Verifica la configuración de AWS S3 e intenta nuevamente.',
  code: 'FILE_STORAGE_UNAVAILABLE',
});

const registrarErrorAuth = (contexto, error) => {
  if (esErrorAlmacenamiento(error)) {
    console.error(`${contexto}: fallo de almacenamiento`, {
      name: error?.name,
      code: error?.Code || error?.code,
      status: error?.$metadata?.httpStatusCode,
      requestId: error?.$metadata?.requestId,
    });
    return;
  }

  console.error(contexto, error);
};

const subirArchivosRegistro = async (req, rol, archivoTituloFwd) => {
  const archivos = {
    tituloFwdUrl: '',
    cedulaJuridicaUrl: null,
    fotoPerfilUrl: null,
  };

  if (rol === 'ESTUDIANTE' && archivoTituloFwd) {
    archivos.tituloFwdUrl = await uploadFileToS3(archivoTituloFwd, 'titulos_fwd');
  }

  const archivoCedulaJuridica = obtenerArchivo(req, 'cedula_juridica_file');
  if (rol === 'EMPRESARIO' && archivoCedulaJuridica) {
    archivos.cedulaJuridicaUrl = await uploadFileToS3(archivoCedulaJuridica, 'cedulas_juridicas');
  }

  const archivoFotoPerfil = obtenerArchivo(req, 'foto_perfil_file');
  if (archivoFotoPerfil) {
    archivos.fotoPerfilUrl = await uploadFileToS3(archivoFotoPerfil, 'fotos_perfil');
  }

  return archivos;
};

>>>>>>> d484eb4090edbc13f882214eded7253e0543bf11
// ── Controladores ─────────────────────────────────────────────────────────────

const register = async (req, res) => {
  try {
    const { nombre, email, password, cedula, rol, telefono_whatsapp, titulo_fwd, tipo_empresa, sector } = req.body;
    const correoNormalizado = String(email || '').trim().toLowerCase();
    const cedulaNormalizada = String(cedula || '').trim();

    if (!nombre || !email || !password || !cedula || !rol) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos: nombre, email, password, cedula, rol',
      });
    }

    if (!ROLES_REGISTRO.has(rol)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido para registro.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    const existingUser = await Usuario.findOne({
      where: {
        [Op.or]: [
          { correo: correoNormalizado },
          { cedula: cedulaNormalizada },
        ],
      },
    });
    if (existingUser) {
      if (existingUser.cedula === cedulaNormalizada) return respuestaConflictoCedula(res);
      return res.status(409).json({
        success: false,
        message: 'Ya existe una cuenta con ese email',
      });
    }

    const archivoTituloFwd = obtenerArchivo(req, 'titulo_fwd_file');
    if (rol === 'ESTUDIANTE') {
      const errorEvidencia = validarEvidenciaFwd(archivoTituloFwd);
      if (errorEvidencia) {
        return res.status(400).json({ success: false, message: errorEvidencia });
      }
    }

    const archivos = await subirArchivosRegistro(req, rol, archivoTituloFwd);
    const hashedPassword = await bcrypt.hash(password, 10);

    await sequelize.transaction(async (transaction) => {
      const newUser = await Usuario.create({
        nombre: String(nombre).trim(),
        correo: correoNormalizado,
        contrasena_hash: hashedPassword,
        cedula: cedulaNormalizada,
        rol,
        telefono_whatsapp,
        tipo_empresa: rol === 'EMPRESARIO' ? tipo_empresa : null,
        foto_perfil: archivos.fotoPerfilUrl,
        perfil_completo: true
      }, { transaction });

      if (rol === 'ESTUDIANTE') {
        await PerfilEstudiante.create({
          id_usuario: newUser.id_usuario,
          titulo_fwd: archivos.tituloFwdUrl || titulo_fwd || '',
          telefono_whatsapp
        }, { transaction });
      } else if (rol === 'EMPRESARIO') {
        await PerfilEmpresario.create({
          id_usuario: newUser.id_usuario,
          sector: sector || 'No especificado',
          telefono_whatsapp,
          cedula_juridica_archivo: archivos.cedulaJuridicaUrl
        }, { transaction });
      }
    });
    
    return res.status(201).json({
      success: true,
      pendingApproval: true,
      message: '¡Cuenta creada exitosamente! Tu cuenta está pendiente de aprobación por un administrador. Te notificaremos cuando sea activada.',
    });
  } catch (error) {
    registrarErrorAuth('Error en register', error);
    if (esConflictoCedula(error)) return respuestaConflictoCedula(res);
    if (esErrorAlmacenamiento(error)) return responderErrorAlmacenamiento(res);

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
    const token = generateToken(user, '2h');
    res.cookie('token', token, adminCookieOptions);

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
  let nombreEmpresa = null;
  if (req.user.rol === 'empresa') {
    try {
      const perfil = await PerfilEmpresario.findOne({
        where: { id_usuario: req.user.id_usuario },
        attributes: ['nombre_empresa'],
      });
      if (perfil) nombreEmpresa = perfil.nombre_empresa;
    } catch { /* silent fallback */ }
  }
  return res.status(200).json({
    success: true,
    user: {
      id: req.user.id_usuario,
      id_usuario: req.user.id_usuario,
      nombre: req.user.nombre,
      nombre_empresa: nombreEmpresa,
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
    const cedulaNormalizada = String(cedula || '').trim();

    if (!rol || !cedula) {
      return res.status(400).json({
        success: false,
        message: 'Rol y cédula son requeridos',
      });
    }

    if (!ROLES_REGISTRO.has(rol)) {
      return res.status(400).json({
        success: false,
        message: 'Rol inválido para completar perfil.',
      });
    }

    const user = await Usuario.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    const usuarioConCedula = await Usuario.findOne({
      where: {
<<<<<<< HEAD
        cedula,
=======
        cedula: cedulaNormalizada,
>>>>>>> d484eb4090edbc13f882214eded7253e0543bf11
        id_usuario: { [Op.ne]: userId }
      }
    });

    if (usuarioConCedula) {
      return respuestaConflictoCedula(res);
    }

    const archivoTituloFwd = obtenerArchivo(req, 'titulo_fwd_file');
    if (rol === 'ESTUDIANTE') {
      const errorEvidencia = validarEvidenciaFwd(archivoTituloFwd);
      if (errorEvidencia) {
        return res.status(400).json({ success: false, message: errorEvidencia });
      }
    }

    const archivos = await subirArchivosRegistro(req, rol, archivoTituloFwd);

    await sequelize.transaction(async (transaction) => {
      await user.update({
        rol,
        cedula: cedulaNormalizada,
        telefono_whatsapp,
        tipo_empresa: rol === 'EMPRESARIO' ? tipo_empresa : null,
        foto_perfil: archivos.fotoPerfilUrl || user.foto_perfil,
        perfil_completo: true
      }, { transaction });

      if (rol === 'ESTUDIANTE') {
        const perfilExistente = await PerfilEstudiante.findOne({ where: { id_usuario: user.id_usuario }, transaction });
        const datosPerfil = {
          titulo_fwd: archivos.tituloFwdUrl,
          telefono_whatsapp
        };
        if (perfilExistente) await perfilExistente.update(datosPerfil, { transaction });
        else await PerfilEstudiante.create({ id_usuario: user.id_usuario, ...datosPerfil }, { transaction });
      } else if (rol === 'EMPRESARIO') {
        const perfilExistente = await PerfilEmpresario.findOne({ where: { id_usuario: user.id_usuario }, transaction });
        const datosPerfil = {
          sector: sector || 'No especificado',
          telefono_whatsapp
        };
        if (archivos.cedulaJuridicaUrl) datosPerfil.cedula_juridica_archivo = archivos.cedulaJuridicaUrl;
        if (perfilExistente) await perfilExistente.update(datosPerfil, { transaction });
        else await PerfilEmpresario.create({ id_usuario: user.id_usuario, ...datosPerfil }, { transaction });
      }
    });

    await user.reload();
    
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
<<<<<<< HEAD
    console.error('Error en completarPerfil:', error);
    if (esConflictoCedula(error)) {
      return respuestaConflictoCedula(res);
    }
=======
    registrarErrorAuth('Error en completarPerfil', error);
    if (esConflictoCedula(error)) {
      return respuestaConflictoCedula(res);
    }
    if (esErrorAlmacenamiento(error)) return responderErrorAlmacenamiento(res);
>>>>>>> d484eb4090edbc13f882214eded7253e0543bf11

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
 
};
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'El correo es requerido',
      });
    }

    const user = await Usuario.findOne({
      where: { correo: email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No existe una cuenta con ese correo',
      });
    }

    // Invalidar códigos activos anteriores
    await CodigoRecuperacion.update(
      { estado: 'EXPIRADO' },
      {
        where: {
          id_usuario: user.id_usuario,
          estado: 'ACTIVO',
        },
      }
    );
    // Enviar el correo de recuperación
    
    

    // Generar código
    const recoveryCode = generateRecoveryCode();

    // Guardar código
    await CodigoRecuperacion.create({
      id_usuario: user.id_usuario,
      codigo: recoveryCode,
      estado: 'ACTIVO',
    });

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
    console.error('Error en forgotPassword:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};
const verifyRecoveryCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Correo y código son requeridos',
      });
    }

    const user = await Usuario.findOne({
      where: { correo: email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No existe una cuenta con ese correo',
      });
    }

    const recoveryCode = await CodigoRecuperacion.findOne({
      where: {
        id_usuario: user.id_usuario,
        codigo: code,
        estado: 'ACTIVO',
      },
    });

    if (!recoveryCode) {
      return res.status(404).json({
        success: false,
        message: 'Código inválido o expirado',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Código verificado correctamente',
    });
  } catch (error) {
    console.error('Error en verifyRecoveryCode:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};
const resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    // Validaciones
    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Email, código y nueva contraseña son requeridos',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    // Buscar usuario
    const user = await Usuario.findOne({
      where: { correo: email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
      });
    }

    // Buscar código activo
    const recovery = await CodigoRecuperacion.findOne({
      where: {
        id_usuario: user.id_usuario,
        codigo: code,
        estado: 'ACTIVO',
      },
    });

    if (!recovery) {
      return res.status(400).json({
        success: false,
        message: 'Código inválido o expirado',
      });
    }

    // Hashear nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar contraseña
    user.contrasena_hash = hashedPassword;
    await user.save();

    // Marcar código como usado
    recovery.estado = 'USADO';
    await recovery.save();

    return res.status(200).json({
      success: true,
      message: 'Contraseña actualizada correctamente',
    });

  } catch (error) {
    console.error('Error en resetPassword:', error);

    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
    });
  }
};


module.exports = { register, login, adminLogin, logout, me, updatePassword, completarPerfil , forgotPassword , verifyRecoveryCode , resetPassword };
