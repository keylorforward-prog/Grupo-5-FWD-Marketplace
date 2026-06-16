const { 
  Usuario, 
  PerfilEstudiante, 
  Propuesta, 
  Reporte, 
  ProyectoPlataforma, 
  Auditoria,
  Configuracion,
  sequelize 
} = require('../Models');

exports.getOverview = async (req, res) => {
  try {
    const totalUsuarios = await Usuario.count();
    const totalEstudiantes = await Usuario.count({ where: { rol: 'ESTUDIANTE' } });
    const totalEmpresarios = await Usuario.count({ where: { rol: 'EMPRESARIO' } });
    const verifiPendientes = await PerfilEstudiante.count({ where: { estado_verificacion: 'PENDIENTE' } });
    const proyectosActivos = await ProyectoPlataforma.count({ where: { estado: 'EN_PROGRESO' } });
    const reportesAbiertos = await Reporte.count({ where: { estado: 'PENDIENTE' } });

    res.json({
      success: true,
      data: {
        totalUsuarios,
        totalEstudiantes,
        totalEmpresarios,
        verifiPendientes,
        proyectosActivos,
        reportesAbiertos
      }
    });
  } catch (error) {
    console.error('Error en admin/overview:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.verifyEstudiante = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_usuario } = req.params;
    const { accion, motivo_rechazo } = req.body; // accion: 'APROBAR' o 'RECHAZAR'
    const adminId = req.user.id_usuario;

    const perfil = await PerfilEstudiante.findOne({ where: { id_usuario } });
    if (!perfil) return res.status(404).json({ success: false, message: 'Perfil no encontrado' });

    const nuevoEstado = accion === 'APROBAR' ? 'VERIFICADO' : 'RECHAZADO';

    await perfil.update({
      estado_verificacion: nuevoEstado,
      verificado_por: adminId,
      fecha_verificacion: new Date(),
      motivo_rechazo: accion === 'RECHAZAR' ? motivo_rechazo : null,
      metodo_verificacion: 'MANUAL'
    }, { transaction: t });

    if (accion === 'APROBAR') {
      await Usuario.update(
        { estado_cuenta: 'ACTIVA' },
        { where: { id_usuario }, transaction: t }
      );
    }

    await Auditoria.create({
      actor_id: adminId,
      accion: `VERIFICACION_${accion}`,
      entidad: 'PerfilEstudiante',
      metadata: { id_usuario, estado_anterior: perfil.estado_verificacion, nuevo_estado: nuevoEstado },
      ip: req.ip,
      user_agent: req.headers['user-agent']
    }, { transaction: t });

    await t.commit();
    res.json({ success: true, message: `Estudiante ${accion === 'APROBAR' ? 'verificado' : 'rechazado'} correctamente` });
  } catch (error) {
    await t.rollback();
    console.error('Error en verifyEstudiante:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.suspendUsuario = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_usuario } = req.params;
    const { accion, motivo } = req.body; // accion: 'SUSPENDER' o 'REACTIVAR'
    const adminId = req.user.id_usuario;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    const nuevoEstado = accion === 'SUSPENDER' ? 'SUSPENDIDA' : 'ACTIVA';

    await usuario.update({
      estado_cuenta: nuevoEstado,
      motivo_suspension: accion === 'SUSPENDER' ? motivo : null,
      suspendido_por: accion === 'SUSPENDER' ? adminId : null,
      fecha_suspension: accion === 'SUSPENDER' ? new Date() : null
    }, { transaction: t });

    await Auditoria.create({
      actor_id: adminId,
      accion: `CUENTA_${accion}`,
      entidad: 'Usuario',
      metadata: { id_usuario, motivo, estado_anterior: usuario.estado_cuenta, nuevo_estado: nuevoEstado },
      ip: req.ip,
      user_agent: req.headers['user-agent']
    }, { transaction: t });

    await t.commit();
    res.json({ success: true, message: `Cuenta ${nuevoEstado.toLowerCase()} correctamente` });
  } catch (error) {
    await t.rollback();
    console.error('Error en suspendUsuario:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['contrasena_hash'] },
      order: [['fecha_registro', 'DESC']]
    });
    res.json({ success: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error obteniendo usuarios' });
  }
};

exports.getEgresadosPendientes = async (req, res) => {
  try {
    const pendientes = await PerfilEstudiante.findAll({
      where: { estado_verificacion: 'PENDIENTE' },
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id_usuario', 'nombre', 'cedula', 'correo', 'telefono_whatsapp', 'estado_cuenta', 'fecha_registro']
      }],
      order: [[{ model: Usuario, as: 'usuario' }, 'fecha_registro', 'ASC']]
    });
    res.json({ success: true, data: pendientes });
  } catch (error) {
    console.error('Error en getEgresadosPendientes:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo pendientes' });
  }
};
