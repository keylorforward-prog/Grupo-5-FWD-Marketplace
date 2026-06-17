const { 
  Usuario, 
  PerfilEstudiante, 
  PerfilEmpresario,
  Propuesta, 
  Reporte, 
  ProyectoPlataforma, 
  Auditoria,
  Configuracion,
  sequelize 
} = require('../Models');

const CONFIGURACION_DEFAULTS = [
  {
    clave: 'marketplace_activo',
    valor: true,
    tipo: 'boolean',
    grupo: 'Operacion',
    descripcion: 'Permite activar o pausar las funciones principales del marketplace.'
  },
  {
    clave: 'requiere_verificacion_egresados',
    valor: true,
    tipo: 'boolean',
    grupo: 'Confianza',
    descripcion: 'Exige aprobacion manual antes de que un egresado pueda usar la plataforma.'
  },
  {
    clave: 'aprobacion_empresas_manual',
    valor: true,
    tipo: 'boolean',
    grupo: 'Confianza',
    descripcion: 'Mantiene las cuentas de empresa en revision antes de activarlas.'
  },
  {
    clave: 'limite_proyectos_empresa',
    valor: 4,
    tipo: 'number',
    grupo: 'Limites',
    descripcion: 'Cantidad maxima de proyectos activos por empresa.'
  },
  {
    clave: 'limite_postulaciones_egresado',
    valor: 8,
    tipo: 'number',
    grupo: 'Limites',
    descripcion: 'Cantidad maxima de postulaciones activas por egresado.'
  },
  {
    clave: 'presupuesto_minimo_proyecto',
    valor: 100,
    tipo: 'number',
    grupo: 'Proyectos',
    descripcion: 'Presupuesto minimo permitido al publicar un proyecto.'
  },
  {
    clave: 'sla_verificacion_horas',
    valor: 24,
    tipo: 'number',
    grupo: 'Operacion',
    descripcion: 'Horas objetivo para resolver verificaciones pendientes.'
  },
  {
    clave: 'soporte_email',
    valor: 'soporte@fwd.com',
    tipo: 'text',
    grupo: 'Comunicacion',
    descripcion: 'Correo visible para soporte administrativo y operativo.'
  },
  {
    clave: 'mensaje_mantenimiento',
    valor: 'Estamos realizando mantenimiento programado. Vuelve pronto.',
    tipo: 'textarea',
    grupo: 'Comunicacion',
    descripcion: 'Mensaje mostrado cuando la plataforma se encuentre en mantenimiento.'
  }
];

const parseConfigValue = (valor, fallback) => {
  try {
    return JSON.parse(valor);
  } catch {
    return valor ?? fallback;
  }
};

const normalizarConfiguracion = (registroPorClave) => CONFIGURACION_DEFAULTS.map((definicion) => {
  const registro = registroPorClave.get(definicion.clave);
  const valor = registro ? parseConfigValue(registro.valor, definicion.valor) : definicion.valor;

  return {
    ...definicion,
    valor,
    id_configuracion: registro?.id_configuracion || null,
    fecha_modificacion: registro?.fecha_modificacion || null,
    modificado_por: registro?.modificado_por || null
  };
});

const validarValorConfiguracion = (definicion, valor) => {
  if (definicion.tipo === 'boolean') return typeof valor === 'boolean';
  if (definicion.tipo === 'number') return typeof valor === 'number' && Number.isFinite(valor) && valor >= 0;
  return typeof valor === 'string' && valor.trim().length > 0;
};

exports.getOverview = async (req, res) => {
  try {
    const [
      totalUsuarios,
      totalEstudiantes,
      totalEmpresarios,
      verifiPendientes,
      empresasPendientes,
      proyectosActivos,
      reportesAbiertos,
      actividadReciente
    ] = await Promise.all([
      Usuario.count(),
      Usuario.count({ where: { rol: 'ESTUDIANTE' } }),
      Usuario.count({ where: { rol: 'EMPRESARIO' } }),
      PerfilEstudiante.count({ where: { estado_verificacion: 'PENDIENTE' } }),
      Usuario.count({ where: { rol: 'EMPRESARIO', estado_cuenta: 'PENDIENTE' } }),
      ProyectoPlataforma.count({ where: { estado: 'EN_PROGRESO' } }),
      Reporte.count({ where: { estado: 'PENDIENTE' } }),
      Auditoria.findAll({
        include: [{ model: Usuario, as: 'actor', attributes: ['nombre', 'correo'], required: false }],
        order: [['fecha', 'DESC']],
        limit: 8
      })
    ]);

    res.json({
      success: true,
      data: {
        totalUsuarios,
        totalEstudiantes,
        totalEmpresarios,
        verifiPendientes,
        empresasPendientes,
        proyectosActivos,
        reportesAbiertos,
        actividadReciente: actividadReciente.map((evento) => ({
          id_auditoria: evento.id_auditoria,
          actor: evento.actor?.nombre || 'Sistema',
          actor_correo: evento.actor?.correo || null,
          accion: evento.accion,
          entidad: evento.entidad,
          metadata: evento.metadata,
          fecha: evento.fecha
        }))
      }
    });
  } catch (error) {
    console.error('Error en admin/overview:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

exports.getConfiguracion = async (req, res) => {
  try {
    const registros = await Configuracion.findAll();
    const registroPorClave = new Map(registros.map((registro) => [registro.clave, registro]));

    res.json({
      success: true,
      data: normalizarConfiguracion(registroPorClave)
    });
  } catch (error) {
    console.error('Error en getConfiguracion:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo configuracion' });
  }
};

exports.updateConfiguracion = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { configuracion } = req.body;
    const adminId = req.user.id_usuario;

    if (!Array.isArray(configuracion)) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'configuracion debe ser un arreglo' });
    }

    const definiciones = new Map(CONFIGURACION_DEFAULTS.map((item) => [item.clave, item]));
    const clavesRecibidas = new Set();

    for (const item of configuracion) {
      const definicion = definiciones.get(item.clave);
      if (!definicion) {
        await t.rollback();
        return res.status(400).json({ success: false, message: `Clave no permitida: ${item.clave}` });
      }

      if (clavesRecibidas.has(item.clave)) {
        await t.rollback();
        return res.status(400).json({ success: false, message: `Clave duplicada: ${item.clave}` });
      }

      if (!validarValorConfiguracion(definicion, item.valor)) {
        await t.rollback();
        return res.status(400).json({ success: false, message: `Valor invalido para ${item.clave}` });
      }

      clavesRecibidas.add(item.clave);

      const valorSerializado = JSON.stringify(item.valor);
      const registroExistente = await Configuracion.findOne({ where: { clave: item.clave }, transaction: t });

      if (registroExistente) {
        await registroExistente.update({
          valor: valorSerializado,
          descripcion: definicion.descripcion,
          modificado_por: adminId,
          fecha_modificacion: new Date()
        }, { transaction: t });
      } else {
        await Configuracion.create({
          clave: item.clave,
          valor: valorSerializado,
          descripcion: definicion.descripcion,
          modificado_por: adminId,
          fecha_modificacion: new Date()
        }, { transaction: t });
      }
    }

    await Auditoria.create({
      actor_id: adminId,
      accion: 'CONFIGURACION_ACTUALIZADA',
      entidad: 'Configuracion',
      metadata: { claves: Array.from(clavesRecibidas) },
      ip: req.ip,
      user_agent: req.headers['user-agent']
    }, { transaction: t });

    await t.commit();

    const registros = await Configuracion.findAll();
    const registroPorClave = new Map(registros.map((registro) => [registro.clave, registro]));

    res.json({
      success: true,
      message: 'Configuracion actualizada correctamente',
      data: normalizarConfiguracion(registroPorClave)
    });
  } catch (error) {
    await t.rollback();
    console.error('Error en updateConfiguracion:', error);
    res.status(500).json({ success: false, message: 'Error actualizando configuracion' });
  }
};

exports.verifyEstudiante = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_usuario } = req.params;
    const { accion, motivo_rechazo } = req.body; // accion: 'APROBAR' o 'RECHAZAR'
    const adminId = req.user.id_usuario;

    if (!['APROBAR', 'RECHAZAR'].includes(accion)) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Accion invalida' });
    }

    if (accion === 'RECHAZAR' && !motivo_rechazo?.trim()) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'El motivo de rechazo es requerido' });
    }

    const perfil = await PerfilEstudiante.findOne({ where: { id_usuario } });
    if (!perfil) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Perfil no encontrado' });
    }

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

    if (!['SUSPENDER', 'REACTIVAR'].includes(accion)) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Accion invalida' });
    }

    if (accion === 'SUSPENDER' && !motivo?.trim()) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'El motivo de suspension es requerido' });
    }

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

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

exports.getEmpresas = async (req, res) => {
  try {
    const [usuariosEmpresa, resumenPropuestas] = await Promise.all([
      Usuario.findAll({
        where: { rol: 'EMPRESARIO' },
        attributes: { exclude: ['contrasena_hash'] },
        include: [{
          model: PerfilEmpresario,
          as: 'perfilEmpresario',
          required: false
        }],
        order: [['fecha_registro', 'DESC']]
      }),
      Propuesta.findAll({
        attributes: [
          'id_perfil_empresario',
          'estado',
          [sequelize.fn('COUNT', sequelize.col('id_propuesta')), 'total']
        ],
        group: ['id_perfil_empresario', 'estado'],
        raw: true
      })
    ]);

    const metricasPorPerfil = resumenPropuestas.reduce((acc, fila) => {
      const idPerfil = fila.id_perfil_empresario;
      if (!acc[idPerfil]) {
        acc[idPerfil] = { totalProyectos: 0, proyectosActivos: 0, proyectosCerrados: 0 };
      }

      const total = Number(fila.total || 0);
      acc[idPerfil].totalProyectos += total;
      if (fila.estado === 'ACTIVA') acc[idPerfil].proyectosActivos += total;
      if (fila.estado === 'CERRADA') acc[idPerfil].proyectosCerrados += total;
      return acc;
    }, {});

    const empresas = usuariosEmpresa.map((usuario) => {
      const perfil = usuario.perfilEmpresario;
      const idPerfil = perfil?.id_perfil_empresario;
      const metricas = metricasPorPerfil[idPerfil] || { totalProyectos: 0, proyectosActivos: 0, proyectosCerrados: 0 };

      return {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        cedula: usuario.cedula,
        correo: usuario.correo,
        telefono_whatsapp: usuario.telefono_whatsapp,
        tipo_empresa: usuario.tipo_empresa,
        estado_cuenta: usuario.estado_cuenta,
        fecha_registro: usuario.fecha_registro,
        ultimo_acceso: usuario.ultimo_acceso,
        perfil: perfil ? {
          id_perfil_empresario: perfil.id_perfil_empresario,
          sector: perfil.sector,
          descripcion: perfil.descripcion,
          logo: perfil.logo,
          sitio_web: perfil.sitio_web,
          telefono_whatsapp: perfil.telefono_whatsapp,
          cedula_juridica_archivo: perfil.cedula_juridica_archivo
        } : null,
        metricas
      };
    });

    res.json({ success: true, data: empresas });
  } catch (error) {
    console.error('Error en getEmpresas:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo empresas' });
  }
};

exports.updateEstadoEmpresa = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_usuario } = req.params;
    const { accion, motivo } = req.body; // APROBAR, SUSPENDER o REACTIVAR
    const adminId = req.user.id_usuario;

    const usuario = await Usuario.findByPk(id_usuario);
    if (!usuario || usuario.rol !== 'EMPRESARIO') {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Empresa no encontrada' });
    }

    if (!['APROBAR', 'SUSPENDER', 'REACTIVAR'].includes(accion)) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Accion invalida' });
    }

    if (accion === 'SUSPENDER' && !motivo?.trim()) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'El motivo de suspension es requerido' });
    }

    const nuevoEstado = accion === 'SUSPENDER' ? 'SUSPENDIDA' : 'ACTIVA';

    await usuario.update({
      estado_cuenta: nuevoEstado,
      motivo_suspension: accion === 'SUSPENDER' ? motivo : null,
      suspendido_por: accion === 'SUSPENDER' ? adminId : null,
      fecha_suspension: accion === 'SUSPENDER' ? new Date() : null
    }, { transaction: t });

    await Auditoria.create({
      actor_id: adminId,
      accion: `EMPRESA_${accion}`,
      entidad: 'Usuario',
      metadata: {
        id_usuario,
        motivo,
        estado_anterior: usuario.estado_cuenta,
        nuevo_estado: nuevoEstado
      },
      ip: req.ip,
      user_agent: req.headers['user-agent']
    }, { transaction: t });

    await t.commit();
    res.json({ success: true, message: `Empresa ${nuevoEstado.toLowerCase()} correctamente` });
  } catch (error) {
    await t.rollback();
    console.error('Error en updateEstadoEmpresa:', error);
    res.status(500).json({ success: false, message: 'Error actualizando empresa' });
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
