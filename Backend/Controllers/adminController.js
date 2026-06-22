const { 
  Usuario, 
  PerfilEstudiante, 
  PerfilEmpresario,
  Propuesta, 
  Reporte, 
  ProyectoPlataforma, 
  Auditoria,
  Configuracion,
  Notificacion,
  Postulacion,
  Oferta,
  CatalogoTecnologia,
  sequelize 
} = require('../Models');
const { Op } = require('sequelize');
const { HeadBucketCommand } = require('@aws-sdk/client-s3');
const { s3Client } = require('../Config/aws');

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

const copiarCamposPermitidos = (origen, campos) => campos.reduce((acumulado, campo) => {
  if (Object.prototype.hasOwnProperty.call(origen || {}, campo)) {
    acumulado[campo] = origen[campo] === '' ? null : origen[campo];
  }
  return acumulado;
}, {});

const obtenerPaginacion = (query, defecto = 25) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || defecto, 1), 100);
  return {
    page,
    limit,
    offset: (page - 1) * limit
  };
};

const esEvidenciaFwdS3Valida = (valor) => {
  if (typeof valor !== 'string') return false;

  try {
    const url = new URL(valor);
    const bucket = process.env.S3_BUCKET_NAME || 'marketplacefwd';
    const hostValido = url.hostname === `${bucket}.s3.${process.env.AWS_REGION || 'us-east-2'}.amazonaws.com`
      || url.hostname === `${bucket}.s3.amazonaws.com`;
    const carpetaValida = url.pathname.startsWith('/titulos_fwd/');
    const extensionValida = /\.(pdf|png|jpe?g|webp)$/i.test(url.pathname);
    return hostValido && carpetaValida && extensionValida;
  } catch {
    return false;
  }
};

const responderCsv = (res, nombreArchivo, filas) => {
  const escape = (valor) => {
    if (valor === null || valor === undefined) return '';
    const texto = String(valor).replace(/"/g, '""');
    return /[",\n]/.test(texto) ? `"${texto}"` : texto;
  };
  const headers = Object.keys(filas[0] || { empty: '' });
  const csv = [
    headers.join(','),
    ...filas.map((fila) => headers.map((header) => escape(fila[header])).join(','))
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${nombreArchivo}"`);
  res.status(200).send(csv);
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

    const perfil = await PerfilEstudiante.findOne({
      where: { id_usuario },
      include: [{
        model: Usuario,
        as: 'usuario',
        attributes: ['id_usuario', 'nombre', 'correo', 'rol', 'estado_cuenta']
      }],
      transaction: t
    });
    if (!perfil) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Perfil no encontrado' });
    }

    if (perfil.usuario?.rol !== 'ESTUDIANTE') {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Solo se pueden verificar cuentas de egresado FWD' });
    }

    if (accion === 'APROBAR' && !esEvidenciaFwdS3Valida(perfil.titulo_fwd)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: 'No se puede aprobar: falta evidencia FWD valida subida a S3.'
      });
    }

    const nuevoEstado = accion === 'APROBAR' ? 'VERIFICADO' : 'RECHAZADO';
    const estadoAnterior = perfil.estado_verificacion;

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
      metadata: {
        id_usuario,
        estado_anterior: estadoAnterior,
        nuevo_estado: nuevoEstado,
        evidencia_s3: perfil.titulo_fwd
      },
      ip: req.ip,
      user_agent: req.headers['user-agent']
    }, { transaction: t });

    await Notificacion.create({
      id_usuario,
      tipo: accion === 'APROBAR' ? 'VERIFICACION_APROBADA' : 'VERIFICACION_RECHAZADA',
      mensaje: accion === 'APROBAR'
        ? 'Tu evidencia FWD fue revisada y tu cuenta de egresado ya esta verificada.'
        : `Tu evidencia FWD fue rechazada.${motivo_rechazo ? ` Motivo: ${motivo_rechazo.trim()}` : ''}`,
      leido: false,
      fecha: new Date()
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
    const { page, limit, offset } = obtenerPaginacion(req.query, 25);
    const search = String(req.query.search || '').trim();
    const estado = String(req.query.estado || '').trim();
    const whereUsuario = { rol: 'EMPRESARIO' };

    if (estado && estado !== 'TODAS') {
      whereUsuario.estado_cuenta = estado;
    }

    if (search) {
      whereUsuario[Op.or] = [
        { nombre: { [Op.iLike]: `%${search}%` } },
        { correo: { [Op.iLike]: `%${search}%` } },
        { cedula: { [Op.iLike]: `%${search}%` } },
        { tipo_empresa: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const usuariosEmpresa = await Usuario.findAndCountAll({
      where: whereUsuario,
      attributes: { exclude: ['contrasena_hash'] },
      include: [{
        model: PerfilEmpresario,
        as: 'perfilEmpresario',
        required: false
      }],
      order: [['fecha_registro', 'DESC']],
      limit,
      offset,
      distinct: true
    });

    const idsPerfil = usuariosEmpresa.rows
      .map((usuario) => usuario.perfilEmpresario?.id_perfil_empresario)
      .filter(Boolean);

    const resumenPropuestas = idsPerfil.length
      ? await Propuesta.findAll({
        where: { id_perfil_empresario: { [Op.in]: idsPerfil } },
        attributes: [
          'id_perfil_empresario',
          'estado',
          [sequelize.fn('COUNT', sequelize.col('id_propuesta')), 'total']
        ],
        group: ['id_perfil_empresario', 'estado'],
        raw: true
      })
      : [];

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

    const empresas = usuariosEmpresa.rows.map((usuario) => {
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

    res.json({
      success: true,
      data: empresas,
      meta: {
        page,
        limit,
        total: usuariosEmpresa.count,
        hasMore: offset + empresas.length < usuariosEmpresa.count
      }
    });
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

exports.getProyectos = async (req, res) => {
  try {
    const { page, limit, offset } = obtenerPaginacion(req.query, 25);
    const search = String(req.query.search || '').trim();
    const where = {};

    if (search) {
      where[Op.or] = [
        { titulo: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const propuestas = await Propuesta.findAndCountAll({
      where,
      include: [
        {
          model: PerfilEmpresario,
          as: 'perfilEmpresario',
          required: true,
          include: [
            {
              model: Usuario,
              as: 'usuario',
              attributes: ['nombre', 'correo']
            }
          ]
        },
        {
          model: Postulacion,
          as: 'postulaciones',
          required: false,
          attributes: ['id_postulacion']
        },
        {
          model: CatalogoTecnologia,
          as: 'tecnologias',
          required: false,
          attributes: ['nombre']
        }
      ],
      order: [['fecha_publicacion', 'DESC']],
      limit,
      offset,
      distinct: true
    });

    const proyectos = propuestas.rows.map(p => {
      let tecs = [];
      if (p.tecnologias && p.tecnologias.length > 0) {
        tecs = p.tecnologias.map(t => t.nombre);
      } else if (p.tecnologias_requeridas) {
        tecs = p.tecnologias_requeridas.split(',').map(t => t.trim()).filter(Boolean);
      }

      return {
        id_proyecto: p.id_propuesta,
        titulo: p.titulo,
        creador: p.perfilEmpresario?.usuario?.nombre || 'Desconocido',
        fecha_creacion: p.fecha_publicacion,
        cantidad_egresados: p.postulaciones ? p.postulaciones.length : 0,
        estado: p.estado,
        tecnologias: tecs
      };
    });

    res.json({
      success: true,
      data: proyectos,
      meta: {
        page,
        limit,
        total: propuestas.count,
        hasMore: offset + proyectos.length < propuestas.count
      }
    });
  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo proyectos' });
  }
};

exports.getUsuarios = async (req, res) => {
  try {
    const { page, limit, offset } = obtenerPaginacion(req.query, 25);
    const search = String(req.query.search || '').trim();
    const rol = String(req.query.rol || '').trim();
    const estado = String(req.query.estado || '').trim();
    const where = {};

    if (rol && rol !== 'TODOS') where.rol = rol;
    if (estado && estado !== 'TODOS') where.estado_cuenta = estado;
    if (search) {
      where[Op.or] = [
        { nombre: { [Op.iLike]: `%${search}%` } },
        { correo: { [Op.iLike]: `%${search}%` } },
        { cedula: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const usuarios = await Usuario.findAndCountAll({
      where,
      attributes: { exclude: ['contrasena_hash'] },
      include: [
        { model: PerfilEstudiante, as: 'perfilEstudiante', required: false },
        { model: PerfilEmpresario, as: 'perfilEmpresario', required: false }
      ],
      order: [['fecha_registro', 'DESC']],
      limit,
      offset,
      distinct: true
    });
    res.json({
      success: true,
      data: usuarios.rows,
      meta: {
        page,
        limit,
        total: usuarios.count,
        hasMore: offset + usuarios.rows.length < usuarios.count
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error obteniendo usuarios' });
  }
};

exports.updateUsuario = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_usuario } = req.params;
    const adminId = req.user.id_usuario;
    const { usuario = {}, perfilEstudiante = null, perfilEmpresario = null } = req.body;

    const usuarioActual = await Usuario.findByPk(id_usuario, {
      include: [
        { model: PerfilEstudiante, as: 'perfilEstudiante', required: false },
        { model: PerfilEmpresario, as: 'perfilEmpresario', required: false }
      ],
      transaction: t
    });

    if (!usuarioActual) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const camposUsuario = [
      'nombre',
      'cedula',
      'correo',
      'rol',
      'foto_perfil',
      'estado_cuenta',
      'telefono_whatsapp',
      'cargo',
      'estado_admin',
      'tipo_empresa',
      'provider',
      'avatar_url',
      'perfil_completo'
    ];
    const cambiosUsuario = copiarCamposPermitidos(usuario, camposUsuario);

    if (cambiosUsuario.correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cambiosUsuario.correo)) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Correo invalido' });
    }

    if (cambiosUsuario.rol && !['ADMIN', 'ESTUDIANTE', 'EMPRESARIO'].includes(cambiosUsuario.rol)) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Rol invalido' });
    }

    if (cambiosUsuario.estado_cuenta && !['ACTIVA', 'PENDIENTE', 'SUSPENDIDA'].includes(cambiosUsuario.estado_cuenta)) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Estado de cuenta invalido' });
    }

    if (cambiosUsuario.estado_admin && !['ACTIVO', 'INACTIVO'].includes(cambiosUsuario.estado_admin)) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Estado admin invalido' });
    }

    if (Object.keys(cambiosUsuario).length > 0) {
      await usuarioActual.update(cambiosUsuario, { transaction: t });
    }

    if (perfilEstudiante) {
      const camposPerfilEstudiante = [
        'titulo_fwd',
        'sede_graduacion',
        'estado_verificacion',
        'reputacion_total',
        'descripcion',
        'telefono_whatsapp',
        'motivo_rechazo',
        'metodo_verificacion',
        'match_automatico'
      ];
      const cambiosPerfil = copiarCamposPermitidos(perfilEstudiante, camposPerfilEstudiante);

      if (cambiosPerfil.estado_verificacion && !['PENDIENTE', 'VERIFICADO', 'RECHAZADO'].includes(cambiosPerfil.estado_verificacion)) {
        await t.rollback();
        return res.status(400).json({ success: false, message: 'Estado de verificacion invalido' });
      }

      if (cambiosPerfil.metodo_verificacion && !['API', 'MANUAL', 'DOCUMENTO'].includes(cambiosPerfil.metodo_verificacion)) {
        await t.rollback();
        return res.status(400).json({ success: false, message: 'Metodo de verificacion invalido' });
      }

      if (Object.keys(cambiosPerfil).length > 0) {
        const [perfil] = await PerfilEstudiante.findOrCreate({
          where: { id_usuario },
          defaults: {
            id_usuario,
            titulo_fwd: cambiosPerfil.titulo_fwd || 'Pendiente',
            telefono_whatsapp: cambiosPerfil.telefono_whatsapp || usuarioActual.telefono_whatsapp
          },
          transaction: t
        });
        await perfil.update(cambiosPerfil, { transaction: t });
      }
    }

    if (perfilEmpresario) {
      const camposPerfilEmpresario = [
        'sector',
        'descripcion',
        'logo',
        'sitio_web',
        'telefono_whatsapp',
        'cedula_juridica_archivo'
      ];
      const cambiosPerfil = copiarCamposPermitidos(perfilEmpresario, camposPerfilEmpresario);

      if (Object.keys(cambiosPerfil).length > 0) {
        const [perfil] = await PerfilEmpresario.findOrCreate({
          where: { id_usuario },
          defaults: {
            id_usuario,
            sector: cambiosPerfil.sector || 'No especificado',
            telefono_whatsapp: cambiosPerfil.telefono_whatsapp || usuarioActual.telefono_whatsapp
          },
          transaction: t
        });
        await perfil.update(cambiosPerfil, { transaction: t });
      }
    }

    await Auditoria.create({
      actor_id: adminId,
      accion: 'USUARIO_EDITADO',
      entidad: 'Usuario',
      metadata: {
        id_usuario,
        campos_usuario: Object.keys(cambiosUsuario),
        edito_perfil_estudiante: Boolean(perfilEstudiante),
        edito_perfil_empresario: Boolean(perfilEmpresario)
      },
      ip: req.ip,
      user_agent: req.headers['user-agent']
    }, { transaction: t });

    await t.commit();

    const actualizado = await Usuario.findByPk(id_usuario, {
      attributes: { exclude: ['contrasena_hash'] },
      include: [
        { model: PerfilEstudiante, as: 'perfilEstudiante', required: false },
        { model: PerfilEmpresario, as: 'perfilEmpresario', required: false }
      ]
    });

    res.json({ success: true, message: 'Usuario actualizado correctamente', data: actualizado });
  } catch (error) {
    await t.rollback();
    console.error('Error en updateUsuario:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ success: false, message: 'Correo o cedula ya estan en uso' });
    }
    res.status(500).json({ success: false, message: 'Error actualizando usuario' });
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

exports.getUsuarioDetalle = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const usuario = await Usuario.findByPk(id_usuario, {
      attributes: { exclude: ['contrasena_hash'] },
      include: [
        { model: PerfilEstudiante, as: 'perfilEstudiante', required: false },
        { model: PerfilEmpresario, as: 'perfilEmpresario', required: false }
      ]
    });

    if (!usuario) return res.status(404).json({ success: false, message: 'Usuario no encontrado' });

    const [auditoria, notificaciones, reportes, postulaciones, ofertas] = await Promise.all([
      Auditoria.findAll({
        where: { actor_id: id_usuario },
        order: [['fecha', 'DESC']],
        limit: 20
      }),
      Notificacion.findAll({ where: { id_usuario }, order: [['fecha', 'DESC']], limit: 20 }),
      Reporte.findAll({ where: { id_usuario }, order: [['fecha_reporte', 'DESC']], limit: 20 }),
      usuario.perfilEstudiante
        ? Postulacion.count({ where: { id_perfil_estudiante: usuario.perfilEstudiante.id_perfil_estudiante } })
        : 0,
      usuario.perfilEstudiante
        ? Oferta.count({ where: { id_perfil_estudiante: usuario.perfilEstudiante.id_perfil_estudiante } })
        : 0
    ]);

    res.json({
      success: true,
      data: {
        usuario,
        auditoria,
        notificaciones,
        reportes,
        actividad: {
          postulaciones,
          ofertas
        }
      }
    });
  } catch (error) {
    console.error('Error en getUsuarioDetalle:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo detalle de usuario' });
  }
};

exports.getAuditoria = async (req, res) => {
  try {
    const { page, limit, offset } = obtenerPaginacion(req.query, 25);
    const { accion, entidad, actor, desde, hasta } = req.query;
    const where = {};

    if (accion) where.accion = { [Op.iLike]: `%${accion}%` };
    if (entidad) where.entidad = entidad;
    if (actor) where.actor_id = actor;
    if (desde || hasta) {
      where.fecha = {};
      if (desde) where.fecha[Op.gte] = new Date(desde);
      if (hasta) where.fecha[Op.lte] = new Date(hasta);
    }

    const auditoria = await Auditoria.findAndCountAll({
      where,
      include: [{ model: Usuario, as: 'actor', attributes: ['id_usuario', 'nombre', 'correo'], required: false }],
      order: [['fecha', 'DESC']],
      limit,
      offset
    });

    res.json({
      success: true,
      data: auditoria.rows,
      meta: { page, limit, total: auditoria.count, hasMore: offset + auditoria.rows.length < auditoria.count }
    });
  } catch (error) {
    console.error('Error en getAuditoria:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo auditoria' });
  }
};

exports.getReportesAdmin = async (req, res) => {
  try {
    const { page, limit, offset } = obtenerPaginacion(req.query, 25);
    const estado = String(req.query.estado || '').trim();
    const search = String(req.query.search || '').trim();
    const where = {};

    if (estado && estado !== 'TODOS') where.estado = estado;
    if (search) {
      where[Op.or] = [
        { motivo: { [Op.iLike]: `%${search}%` } },
        { descripcion: { [Op.iLike]: `%${search}%` } },
      ];
    }

    const reportes = await Reporte.findAndCountAll({
      where,
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id_usuario', 'nombre', 'correo'], required: false },
        { model: ProyectoPlataforma, as: 'proyecto', required: false }
      ],
      order: [['fecha_reporte', 'DESC']],
      limit,
      offset,
      distinct: true
    });

    res.json({
      success: true,
      data: reportes.rows,
      meta: { page, limit, total: reportes.count, hasMore: offset + reportes.rows.length < reportes.count }
    });
  } catch (error) {
    console.error('Error en getReportesAdmin:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo reportes' });
  }
};

exports.resolverReporte = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id_reporte } = req.params;
    const { estado = 'RESUELTO', comentario_admin, accion_relacionada } = req.body;
    const adminId = req.user.id_usuario;

    if (!['REVISADO', 'RESUELTO'].includes(estado)) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Estado invalido' });
    }

    if (!comentario_admin?.trim()) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'El comentario de resolucion es requerido' });
    }

    const reporte = await Reporte.findByPk(id_reporte, { transaction: t });
    if (!reporte) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
    }

    const estadoAnterior = reporte.estado;
    await reporte.update({ estado }, { transaction: t });

    if (accion_relacionada?.tipo === 'SUSPENDER_USUARIO' && accion_relacionada.id_usuario) {
      await Usuario.update(
        { estado_cuenta: 'SUSPENDIDA' },
        { where: { id_usuario: accion_relacionada.id_usuario }, transaction: t }
      );
    }

    await Auditoria.create({
      actor_id: adminId,
      accion: 'REPORTE_RESUELTO',
      entidad: 'Reporte',
      metadata: {
        id_reporte,
        estado_anterior: estadoAnterior,
        nuevo_estado: estado,
        comentario_admin,
        accion_relacionada
      },
      ip: req.ip,
      user_agent: req.headers['user-agent']
    }, { transaction: t });

    await t.commit();
    const actualizado = await Reporte.findByPk(id_reporte);
    res.json({ success: true, message: 'Reporte actualizado correctamente', data: actualizado });
  } catch (error) {
    await t.rollback();
    console.error('Error en resolverReporte:', error);
    res.status(500).json({ success: false, message: 'Error resolviendo reporte' });
  }
};

exports.getAdminNotificaciones = async (req, res) => {
  try {
    const [egresadosPendientes, empresasPendientes, reportesPendientes, actividadCritica] = await Promise.all([
      PerfilEstudiante.count({ where: { estado_verificacion: 'PENDIENTE' } }),
      Usuario.count({ where: { rol: 'EMPRESARIO', estado_cuenta: 'PENDIENTE' } }),
      Reporte.count({ where: { estado: 'PENDIENTE' } }),
      Auditoria.findAll({ order: [['fecha', 'DESC']], limit: 3 })
    ]);

    const items = [
      egresadosPendientes > 0 && {
        tipo: 'EGRESADOS_PENDIENTES',
        titulo: 'Verificaciones pendientes',
        mensaje: `Hay ${egresadosPendientes} egresados esperando revision`,
        ruta: 'egresados',
        prioridad: 'ALTA'
      },
      empresasPendientes > 0 && {
        tipo: 'EMPRESAS_PENDIENTES',
        titulo: 'Empresas pendientes',
        mensaje: `Hay ${empresasPendientes} empresas esperando aprobacion`,
        ruta: 'empresas',
        prioridad: 'MEDIA'
      },
      reportesPendientes > 0 && {
        tipo: 'REPORTES_PENDIENTES',
        titulo: 'Reportes abiertos',
        mensaje: `Hay ${reportesPendientes} reportes sin resolver`,
        ruta: 'reportes',
        prioridad: 'ALTA'
      },
      ...actividadCritica.map((evento) => ({
        tipo: 'AUDITORIA_RECIENTE',
        titulo: evento.accion,
        mensaje: `${evento.entidad} actualizado recientemente`,
        ruta: 'auditoria',
        prioridad: 'BAJA'
      }))
    ].filter(Boolean);

    res.json({ success: true, data: { items, unreadCount: items.length } });
  } catch (error) {
    console.error('Error en getAdminNotificaciones:', error);
    res.status(500).json({ success: false, message: 'Error obteniendo notificaciones admin' });
  }
};

exports.busquedaGlobal = async (req, res) => {
  try {
    const q = String(req.query.q || '').trim();
    if (q.length < 2) return res.json({ success: true, data: { usuarios: [], empresas: [], egresados: [], reportes: [], auditoria: [] } });

    const like = { [Op.iLike]: `%${q}%` };
    const [usuarios, empresas, egresados, reportes, auditoria] = await Promise.all([
      Usuario.findAll({ where: { [Op.or]: [{ nombre: like }, { correo: like }, { cedula: like }] }, attributes: ['id_usuario', 'nombre', 'correo', 'rol', 'estado_cuenta'], limit: 5 }),
      Usuario.findAll({ where: { rol: 'EMPRESARIO', [Op.or]: [{ nombre: like }, { correo: like }, { cedula: like }, { tipo_empresa: like }] }, attributes: ['id_usuario', 'nombre', 'correo', 'estado_cuenta'], limit: 5 }),
      Usuario.findAll({ where: { rol: 'ESTUDIANTE', [Op.or]: [{ nombre: like }, { correo: like }, { cedula: like }] }, attributes: ['id_usuario', 'nombre', 'correo', 'estado_cuenta'], limit: 5 }),
      Reporte.findAll({ where: { [Op.or]: [{ motivo: like }, { descripcion: like }] }, limit: 5 }),
      Auditoria.findAll({ where: { [Op.or]: [{ accion: like }, { entidad: like }] }, limit: 5, order: [['fecha', 'DESC']] })
    ]);

    res.json({ success: true, data: { usuarios, empresas, egresados, reportes, auditoria } });
  } catch (error) {
    console.error('Error en busquedaGlobal:', error);
    res.status(500).json({ success: false, message: 'Error en busqueda global' });
  }
};

exports.accionesMasivas = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { tipo, ids = [], motivo } = req.body;
    const adminId = req.user.id_usuario;

    if (!Array.isArray(ids) || ids.length === 0 || ids.length > 50) {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Seleccion invalida. Maximo 50 elementos.' });
    }

    const resultados = [];

    if (tipo === 'APROBAR_EMPRESAS') {
      await Usuario.update({ estado_cuenta: 'ACTIVA' }, { where: { id_usuario: { [Op.in]: ids }, rol: 'EMPRESARIO' }, transaction: t });
      ids.forEach((id) => resultados.push({ id, ok: true }));
    } else if (tipo === 'MARCAR_REPORTES_REVISADOS') {
      await Reporte.update({ estado: 'REVISADO' }, { where: { id_reporte: { [Op.in]: ids } }, transaction: t });
      ids.forEach((id) => resultados.push({ id, ok: true }));
    } else if (tipo === 'RECHAZAR_EGRESADOS') {
      if (!motivo?.trim()) {
        await t.rollback();
        return res.status(400).json({ success: false, message: 'Motivo requerido para rechazo masivo' });
      }
      await PerfilEstudiante.update({ estado_verificacion: 'RECHAZADO', motivo_rechazo: motivo, verificado_por: adminId, fecha_verificacion: new Date() }, { where: { id_usuario: { [Op.in]: ids } }, transaction: t });
      ids.forEach((id) => resultados.push({ id, ok: true }));
    } else {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Tipo de accion masiva invalido' });
    }

    await Auditoria.create({
      actor_id: adminId,
      accion: `ACCION_MASIVA_${tipo}`,
      entidad: 'Admin',
      metadata: { ids, motivo, resultados },
      ip: req.ip,
      user_agent: req.headers['user-agent']
    }, { transaction: t });

    await t.commit();
    res.json({ success: true, message: 'Accion masiva ejecutada', resultados });
  } catch (error) {
    await t.rollback();
    console.error('Error en accionesMasivas:', error);
    res.status(500).json({ success: false, message: 'Error ejecutando accion masiva' });
  }
};

exports.exportCsv = async (req, res) => {
  try {
    const { tipo } = req.params;
    let filas = [];

    if (tipo === 'usuarios') {
      const usuarios = await Usuario.findAll({ attributes: ['id_usuario', 'nombre', 'cedula', 'correo', 'rol', 'estado_cuenta', 'fecha_registro'], raw: true });
      filas = usuarios;
    } else if (tipo === 'empresas') {
      const empresas = await Usuario.findAll({ where: { rol: 'EMPRESARIO' }, attributes: ['id_usuario', 'nombre', 'cedula', 'correo', 'estado_cuenta', 'fecha_registro'], raw: true });
      filas = empresas;
    } else if (tipo === 'egresados') {
      const egresados = await PerfilEstudiante.findAll({
        include: [{ model: Usuario, as: 'usuario', attributes: ['nombre', 'correo', 'cedula'], required: true }],
      });
      filas = egresados.map((perfil) => ({
        id_usuario: perfil.id_usuario,
        nombre: perfil.usuario?.nombre,
        correo: perfil.usuario?.correo,
        cedula: perfil.usuario?.cedula,
        estado_verificacion: perfil.estado_verificacion,
        sede_graduacion: perfil.sede_graduacion,
        fecha_verificacion: perfil.fecha_verificacion
      }));
    } else if (tipo === 'reportes') {
      filas = await Reporte.findAll({ raw: true });
    } else if (tipo === 'auditoria') {
      const auditoria = await Auditoria.findAll({ order: [['fecha', 'DESC']], limit: 1000, raw: true });
      filas = auditoria.map((evento) => ({ ...evento, metadata: JSON.stringify(evento.metadata || {}) }));
    } else {
      return res.status(404).json({ success: false, message: 'Export no soportado' });
    }

    await Auditoria.create({
      actor_id: req.user.id_usuario,
      accion: 'EXPORTACION_CSV',
      entidad: tipo,
      metadata: { total: filas.length },
      ip: req.ip,
      user_agent: req.headers['user-agent']
    });

    responderCsv(res, `${tipo}.csv`, filas);
  } catch (error) {
    console.error('Error en exportCsv:', error);
    res.status(500).json({ success: false, message: 'Error exportando CSV' });
  }
};

exports.healthSistema = async (req, res) => {
  const started = Date.now();
  const databaseStarted = Date.now();
  let database = { ok: false, latencyMs: 0 };
  let s3 = { ok: false, bucket: process.env.S3_BUCKET_NAME || 'marketplacefwd' };

  try {
    await sequelize.authenticate();
    database = { ok: true, latencyMs: Date.now() - databaseStarted };
  } catch (error) {
    database = { ok: false, latencyMs: Date.now() - databaseStarted, message: error.message };
  }

  const s3Started = Date.now();
  try {
    await s3Client.send(new HeadBucketCommand({ Bucket: process.env.S3_BUCKET_NAME || 'marketplacefwd' }));
    s3 = { ...s3, ok: true, latencyMs: Date.now() - s3Started };
  } catch (error) {
    s3 = { ...s3, ok: false, latencyMs: Date.now() - s3Started, message: error.message };
  }

  res.json({
    success: true,
    data: {
      api: { ok: true, latencyMs: Date.now() - started },
      database,
      s3,
      env: {
        JWT_SECRET: Boolean(process.env.JWT_SECRET),
        AWS_REGION: Boolean(process.env.AWS_REGION),
        S3_BUCKET_NAME: Boolean(process.env.S3_BUCKET_NAME),
        AWS_ACCESS_KEY_ID: Boolean(process.env.AWS_ACCESS_KEY_ID)
      }
    }
  });
};
