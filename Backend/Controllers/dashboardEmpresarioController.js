const { Op } = require('sequelize');
const {
  Conversacion,
  Curriculum,
  Entregable,
  Evaluacion,
  HistorialProyectoEmpresa,
  HistorialProyectoEstudiante,
  Notificacion,
  Oferta,
  OfertaEmpleo,
  Pago,
  PerfilEmpresario,
  PerfilEstudiante,
  Postulacion,
  Propuesta,
  ProyectoPlataforma,
  sequelize,
  Usuario,
} = require('../Models');

const ORDEN_DESC = [['fecha_publicacion', 'DESC']];
const PRESUPUESTO_MINIMO_PROYECTO = 100000;

const obtenerLimite = (valor, defecto = 20) => {
  const numero = Number.parseInt(valor, 10);
  if (Number.isNaN(numero) || numero <= 0) return defecto;
  return Math.min(numero, 100);
};

const obtenerPagina = (valor) => {
  const numero = Number.parseInt(valor, 10);
  if (Number.isNaN(numero) || numero <= 0) return 1;
  return numero;
};

const construirFiltroTalento = (search) => {
  const terminos = String(search || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 5);

  if (!terminos.length) return {};

  return {
    [Op.and]: terminos.map((termino) => ({
      [Op.or]: [
        { titulo_fwd: { [Op.iLike]: `%${termino}%` } },
        { sede_graduacion: { [Op.iLike]: `%${termino}%` } },
        { descripcion: { [Op.iLike]: `%${termino}%` } },
        { '$usuario.nombre$': { [Op.iLike]: `%${termino}%` } },
        { '$usuario.correo$': { [Op.iLike]: `%${termino}%` } },
        { '$curriculum.habilidades$': { [Op.iLike]: `%${termino}%` } },
        { '$curriculum.resumen_profesional$': { [Op.iLike]: `%${termino}%` } },
        { '$curriculum.experiencia_laboral$': { [Op.iLike]: `%${termino}%` } },
        { '$curriculum.educacion$': { [Op.iLike]: `%${termino}%` } },
        { '$curriculum.certificaciones$': { [Op.iLike]: `%${termino}%` } },
        { '$historialProyectos.titulo_proyecto$': { [Op.iLike]: `%${termino}%` } },
        { '$historialProyectos.descripcion$': { [Op.iLike]: `%${termino}%` } },
        { '$historialProyectos.tecnologias$': { [Op.iLike]: `%${termino}%` } },
        { '$historialProyectos.rol_desempenado$': { [Op.iLike]: `%${termino}%` } },
      ],
    })),
  };
};

const obtenerPerfilEmpresario = async (req, res) => {
  const perfil = await PerfilEmpresario.findOne({
    where: { id_usuario: req.user.id_usuario },
    include: [{ model: Usuario, as: 'usuario' }],
  });

  if (!perfil) {
    res.status(404).json({
      success: false,
      message: 'No existe un PerfilEmpresario para el usuario autenticado.',
    });
    return null;
  }

  return perfil;
};

const obtenerIdsPropuestas = async (idPerfilEmpresario) => {
  const propuestas = await Propuesta.findAll({
    where: { id_perfil_empresario: idPerfilEmpresario },
    attributes: ['id_propuesta'],
    raw: true,
  });
  return propuestas.map((propuesta) => propuesta.id_propuesta);
};

const obtenerIdsProyectos = async (idsPropuestas) => {
  if (!idsPropuestas.length) return [];
  const proyectos = await ProyectoPlataforma.findAll({
    where: { id_propuesta: { [Op.in]: idsPropuestas } },
    attributes: ['id_proyecto'],
    raw: true,
  });
  return proyectos.map((proyecto) => proyecto.id_proyecto);
};

const responderError = (res, error, mensaje) => {
  console.error(mensaje, error);

  if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
    const detalle = error.errors?.map((item) => item.message).filter(Boolean).join(' ') || mensaje;
    res.status(400).json({ success: false, message: detalle });
    return;
  }

  res.status(500).json({ success: false, message: mensaje });
};

const construirFechaLimite = (plazoDias) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + Number(plazoDias));
  return fecha;
};

const listarPerfil = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;
    res.json({ success: true, data: perfil });
  } catch (error) {
    responderError(res, error, 'Error al obtener el perfil empresario.');
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const camposPermitidos = ['sector', 'descripcion', 'sitio_web', 'telefono_whatsapp'];
    const cambios = camposPermitidos.reduce((acumulado, campo) => {
      if (Object.prototype.hasOwnProperty.call(req.body, campo)) {
        acumulado[campo] = req.body[campo];
      }
      return acumulado;
    }, {});

    if (cambios.telefono_whatsapp && !/^\d{4}-\d{4}$/.test(cambios.telefono_whatsapp)) {
      res.status(400).json({
        success: false,
        message: 'El WhatsApp debe tener 8 numeros con formato 0000-0000.',
      });
      return;
    }

    await perfil.update(cambios);
    const actualizado = await PerfilEmpresario.findByPk(perfil.id_perfil_empresario, {
      include: [{ model: Usuario, as: 'usuario' }],
    });

    res.json({ success: true, data: actualizado });
  } catch (error) {
    responderError(res, error, 'Error al actualizar el perfil empresario.');
  }
};

const subirFotoPerfil = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: 'Debes enviar una imagen en el campo foto_perfil.',
      });
      return;
    }

    if (!req.file.mimetype.startsWith('image/')) {
      res.status(400).json({
        success: false,
        message: 'El archivo debe ser una imagen.',
      });
      return;
    }

    const { uploadFileToS3 } = require('../Config/aws');
    const fotoUrl = await uploadFileToS3(req.file, 'fotos_perfil');

    await Promise.all([
      perfil.update({ logo: fotoUrl }),
      perfil.usuario.update({ foto_perfil: fotoUrl }),
    ]);

    const actualizado = await PerfilEmpresario.findByPk(perfil.id_perfil_empresario, {
      include: [{ model: Usuario, as: 'usuario' }],
    });

    res.json({ success: true, data: actualizado });
  } catch (error) {
    responderError(res, error, 'Error al subir la foto de perfil empresario.');
  }
};

const listarPropuestas = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const propuestas = await Propuesta.findAll({
      where: { id_perfil_empresario: perfil.id_perfil_empresario },
      include: [
        { model: Postulacion, as: 'postulaciones' },
        { model: Oferta, as: 'ofertas' },
        { model: ProyectoPlataforma, as: 'proyecto' },
      ],
      order: ORDEN_DESC,
      limit: obtenerLimite(req.query.limit),
    });

    res.json({ success: true, data: propuestas });
  } catch (error) {
    responderError(res, error, 'Error al obtener las propuestas del dashboard.');
  }
};

const crearPropuesta = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const plazoDias = Number(req.body.plazo_dias);
    
    // Convert to null if the string is empty or 'null' (common with FormData)
    const rawMin = req.body.presupuesto_min;
    const presupuestoMin = !rawMin || rawMin === 'null' || rawMin === 'undefined' ? null : Number(rawMin);

    const rawMax = req.body.presupuesto_max;
    const presupuestoMax = !rawMax || rawMax === 'null' || rawMax === 'undefined' ? null : Number(rawMax);

    if (presupuestoMin !== null && presupuestoMin < PRESUPUESTO_MINIMO_PROYECTO) {
      res.status(400).json({
        success: false,
        message: 'El presupuesto minimo debe ser de al menos ₡100.000.',
      });
      return;
    }

    if (presupuestoMin !== null && presupuestoMax !== null && presupuestoMin > presupuestoMax) {
      res.status(400).json({
        success: false,
        message: 'El presupuesto minimo no puede ser mayor al presupuesto maximo.',
      });
      return;
    }

    let urlAdjunto = null;
    let advertenciaAdjunto = null;
    if (req.file) {
      try {
        const { uploadFileToS3 } = require('../Config/aws');
        urlAdjunto = await uploadFileToS3(req.file, 'documentos_propuestas');
      } catch (errorAdjunto) {
        console.error('Error al subir el documento adjunto de la propuesta.', errorAdjunto);
        advertenciaAdjunto = 'La propuesta se publico, pero no se pudo subir el documento adjunto.';
      }
    }

    const rawIaId = req.body.id_conversacion_ia;
    const idConversacionIa = !rawIaId || rawIaId === 'null' || rawIaId === 'undefined' ? null : Number(rawIaId);

    const propuesta = await Propuesta.create({
      id_perfil_empresario: perfil.id_perfil_empresario,
      titulo: req.body.titulo,
      descripcion: req.body.descripcion,
      tecnologias_requeridas: req.body.tecnologias_requeridas,
      usar_ia: req.body.usar_ia === 'SI' ? 'SI' : 'NO',
      plazo_dias: plazoDias,
      presupuesto_min: presupuestoMin,
      presupuesto_max: presupuestoMax,
      estado: 'ACTIVA',
      fecha_limite: construirFechaLimite(plazoDias),
      id_conversacion_ia: idConversacionIa,
      documento_adjunto: urlAdjunto
    });

    res.status(201).json({
      success: true,
      data: propuesta,
      message: advertenciaAdjunto || 'Propuesta creada correctamente.',
      warning: advertenciaAdjunto,
    });
  } catch (error) {
    responderError(res, error, 'Error al crear la propuesta.');
  }
};

const obtenerPropuestaPropia = async (req, res, perfil) => {
  const propuesta = await Propuesta.findOne({
    where: {
      id_propuesta: req.params.id,
      id_perfil_empresario: perfil.id_perfil_empresario,
    },
  });

  if (!propuesta) {
    res.status(404).json({
      success: false,
      message: 'Propuesta no encontrada para esta empresa.',
    });
    return null;
  }

  return propuesta;
};

const actualizarPropuesta = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const propuesta = await obtenerPropuestaPropia(req, res, perfil);
    if (!propuesta) return;

    const camposPermitidos = [
      'titulo',
      'descripcion',
      'tecnologias_requeridas',
      'usar_ia',
      'plazo_dias',
      'presupuesto_min',
      'presupuesto_max',
      'estado',
      'fecha_limite',
    ];
    const cambios = camposPermitidos.reduce((acumulado, campo) => {
      if (Object.prototype.hasOwnProperty.call(req.body, campo)) {
        acumulado[campo] = req.body[campo];
      }
      return acumulado;
    }, {});

    await propuesta.update(cambios);
    const actualizada = await Propuesta.findByPk(propuesta.id_propuesta, {
      include: [
        { model: Postulacion, as: 'postulaciones' },
        { model: Oferta, as: 'ofertas' },
        { model: ProyectoPlataforma, as: 'proyecto' },
      ],
    });

    res.json({ success: true, data: actualizada });
  } catch (error) {
    responderError(res, error, 'Error al actualizar la propuesta.');
  }
};

const eliminarPropuesta = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const propuesta = await obtenerPropuestaPropia(req, res, perfil);
    if (!propuesta) return;

    await propuesta.destroy();
    res.json({ success: true, message: 'Propuesta eliminada correctamente.' });
  } catch (error) {
    responderError(res, error, 'Error al eliminar la propuesta.');
  }
};

const listarOfertas = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const idPropuesta = Number.parseInt(req.query.id_propuesta ?? req.query.propuesta, 10);
    if ((req.query.id_propuesta || req.query.propuesta) && Number.isNaN(idPropuesta)) {
      res.status(400).json({ success: false, message: 'El proyecto solicitado no es valido.' });
      return;
    }

    const wherePropuesta = { id_perfil_empresario: perfil.id_perfil_empresario };
    if (!Number.isNaN(idPropuesta)) wherePropuesta.id_propuesta = idPropuesta;

    const where = {};
    if (req.query.estado === 'pendientes') where.estado = null;

    const ofertas = await Oferta.findAll({
      where,
      include: [
        {
          model: Propuesta,
          as: 'propuestaRef',
          required: true,
          where: wherePropuesta,
        },
        {
          model: PerfilEstudiante,
          as: 'perfilEstudiante',
          include: [
            { model: Usuario, as: 'usuario' },
            { model: Curriculum, as: 'curriculum' },
            { model: HistorialProyectoEstudiante, as: 'historialProyectos' },
          ],
        },
      ],
      order: [['fecha_oferta', 'DESC']],
      limit: obtenerLimite(req.query.limit),
    });

    res.json({ success: true, data: ofertas });
  } catch (error) {
    responderError(res, error, 'Error al obtener las ofertas del dashboard.');
  }
};

const rechazarOferta = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const { id_oferta } = req.params;
    const oferta = await Oferta.findByPk(id_oferta, {
      include: [
        {
          model: Propuesta,
          as: 'propuestaRef',
          required: true,
        },
        {
          model: PerfilEstudiante,
          as: 'perfilEstudiante',
          include: [{ model: Usuario, as: 'usuario' }],
        },
      ],
    });

    if (!oferta) {
      return res.status(404).json({ success: false, message: 'Oferta no encontrada.' });
    }

    const propuesta = oferta.propuestaRef;
    if (!propuesta || propuesta.id_perfil_empresario !== perfil.id_perfil_empresario) {
      return res.status(403).json({ success: false, message: 'No puedes rechazar una oferta de otro empresario.' });
    }

    if (oferta.estado === 'ACEPTADA') {
      return res.status(400).json({ success: false, message: 'No puedes rechazar una oferta aceptada.' });
    }

    if (oferta.estado === 'RECHAZADA') {
      return res.status(400).json({ success: false, message: 'Esta oferta ya fue rechazada.' });
    }

    await oferta.update({ estado: 'RECHAZADA' });

    const usuario = oferta.perfilEstudiante?.usuario;
    if (usuario) {
      await Notificacion.create({
        id_usuario: usuario.id_usuario,
        tipo: 'OFERTA_RECHAZADA',
        mensaje: `Tu oferta para "${propuesta.titulo}" fue rechazada.`,
        leido: false,
        fecha: new Date(),
      });
    }

    res.json({ success: true, message: 'Oferta rechazada correctamente.', data: oferta });
  } catch (error) {
    responderError(res, error, 'Error al rechazar la oferta.');
  }
};

const aceptarOferta = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) {
      await t.rollback();
      return;
    }

    const { id_oferta } = req.params;
    const oferta = await Oferta.findByPk(id_oferta, {
      include: [
        {
          model: Propuesta,
          as: 'propuestaRef',
          required: true,
        },
        {
          model: PerfilEstudiante,
          as: 'perfilEstudiante',
          include: [{ model: Usuario, as: 'usuario' }],
        },
      ],
      transaction: t,
    });

    if (!oferta) {
      await t.rollback();
      return res.status(404).json({ success: false, message: 'Oferta no encontrada.' });
    }

    const propuesta = oferta.propuestaRef;
    if (!propuesta || propuesta.id_perfil_empresario !== perfil.id_perfil_empresario) {
      await t.rollback();
      return res.status(403).json({ success: false, message: 'No puedes aceptar una oferta de otro empresario.' });
    }

    if (propuesta.estado !== 'ACTIVA') {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Esta propuesta ya no esta abierta para adjudicacion.' });
    }

    if (oferta.estado === 'ACEPTADA') {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Esta oferta ya fue aceptada.' });
    }

    if (oferta.estado && oferta.estado !== 'ACEPTADA') {
      await t.rollback();
      return res.status(400).json({ success: false, message: 'Solo puedes aceptar ofertas pendientes.' });
    }

    const fechaInicio = new Date();
    const fechaFinEstimada = new Date(fechaInicio);
    fechaFinEstimada.setDate(fechaFinEstimada.getDate() + Number(propuesta.plazo_dias || 15));

    await oferta.update({ estado: 'ACEPTADA' }, { transaction: t });
    await Oferta.update(
      { estado: 'RECHAZADA' },
      {
        where: {
          id_proyecto: propuesta.id_propuesta,
          id_oferta: { [Op.ne]: oferta.id_oferta },
          estado: null,
        },
        transaction: t,
      }
    );

    await propuesta.update({ estado: 'CERRADA' }, { transaction: t });

    const [proyecto] = await ProyectoPlataforma.findOrCreate({
      where: { id_propuesta: propuesta.id_propuesta },
      defaults: {
        id_propuesta: propuesta.id_propuesta,
        titulo: propuesta.titulo,
        descripcion: propuesta.descripcion,
        estado: 'EN_PROGRESO',
        fecha_inicio: fechaInicio,
        fecha_fin_estimada: fechaFinEstimada,
        fecha_adjudicado: fechaInicio,
      },
      transaction: t,
    });

    await proyecto.update({
      estado: 'EN_PROGRESO',
      fecha_inicio: proyecto.fecha_inicio || fechaInicio,
      fecha_fin_estimada: proyecto.fecha_fin_estimada || fechaFinEstimada,
      fecha_adjudicado: proyecto.fecha_adjudicado || fechaInicio,
    }, { transaction: t });

    await Postulacion.update(
      { estado: 'CONTRATADO' },
      {
        where: {
          id_propuesta: propuesta.id_propuesta,
          id_perfil_estudiante: oferta.id_perfil_estudiante,
        },
        transaction: t,
      }
    );

    await Postulacion.update(
      { estado: 'RECHAZADA' },
      {
        where: {
          id_propuesta: propuesta.id_propuesta,
          id_perfil_estudiante: { [Op.ne]: oferta.id_perfil_estudiante },
          estado: { [Op.ne]: 'CONTRATADO' },
        },
        transaction: t,
      }
    );

    const usuarioAceptado = oferta.perfilEstudiante?.usuario;
    if (usuarioAceptado) {
      await Notificacion.create({
        id_usuario: usuarioAceptado.id_usuario,
        tipo: 'OFERTA_ACEPTADA',
        mensaje: `Tu oferta para "${propuesta.titulo}" fue aceptada. El proyecto ya esta en progreso.`,
        leido: false,
        fecha: new Date(),
      }, { transaction: t });
    }

    const otrasOfertas = await Oferta.findAll({
      where: {
        id_proyecto: propuesta.id_propuesta,
        id_oferta: { [Op.ne]: oferta.id_oferta },
      },
      include: [{ model: PerfilEstudiante, as: 'perfilEstudiante', include: [{ model: Usuario, as: 'usuario' }] }],
      transaction: t,
    });

    await Promise.all(otrasOfertas.map((otraOferta) => {
      const usuario = otraOferta.perfilEstudiante?.usuario;
      if (!usuario) return Promise.resolve();
      return Notificacion.create({
        id_usuario: usuario.id_usuario,
        tipo: 'OFERTA_NO_SELECCIONADA',
        mensaje: `La empresa selecciono otra oferta para "${propuesta.titulo}".`,
        leido: false,
        fecha: new Date(),
      }, { transaction: t });
    }));

    await t.commit();

    res.json({
      success: true,
      message: 'Oferta aceptada y proyecto adjudicado correctamente.',
      data: { oferta, proyecto },
    });
  } catch (error) {
    await t.rollback();
    responderError(res, error, 'Error al aceptar la oferta.');
  }
};

const listarEntregables = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const idsPropuestas = await obtenerIdsPropuestas(perfil.id_perfil_empresario);
    const idsProyectos = await obtenerIdsProyectos(idsPropuestas);
    if (!idsProyectos.length) {
      res.json({ success: true, data: [] });
      return;
    }

    const where = { id_proyecto: { [Op.in]: idsProyectos } };
    if (req.query.estado) where.estado = req.query.estado;

    const entregables = await Entregable.findAll({
      where,
      include: [{ model: ProyectoPlataforma, as: 'proyecto', include: [{ model: Propuesta, as: 'propuesta' }] }],
      order: [['fecha_creacion', 'DESC']],
      limit: obtenerLimite(req.query.limit),
    });

    res.json({ success: true, data: entregables });
  } catch (error) {
    responderError(res, error, 'Error al obtener los entregables del dashboard.');
  }
};

const listarNotificaciones = async (req, res) => {
  try {
    const notificaciones = await Notificacion.findAll({
      where: { id_usuario: req.user.id_usuario },
      order: [['fecha', 'DESC']],
      limit: obtenerLimite(req.query.limit),
    });

    res.json({ success: true, data: notificaciones });
  } catch (error) {
    responderError(res, error, 'Error al obtener las notificaciones.');
  }
};

const listarTalento = async (req, res) => {
  try {
    const search = String(req.query.search || req.query.q || '').trim();
    const searchWhere = construirFiltroTalento(search);
    const include = [
      { model: Usuario, as: 'usuario', required: false },
      { model: Curriculum, as: 'curriculum', required: false },
      { model: Postulacion, as: 'postulaciones', required: false },
      { model: HistorialProyectoEstudiante, as: 'historialProyectos', required: false },
    ];
    const order = [['reputacion_total', 'DESC'], ['fecha_verificacion', 'DESC']];
    const limit = obtenerLimite(req.query.limit, 10);

    if (req.query.page) {
      const page = obtenerPagina(req.query.page);
      const offset = (page - 1) * limit;
      const talento = await PerfilEstudiante.findAndCountAll({
        where: searchWhere,
        include,
        order,
        limit,
        offset,
        distinct: true,
        subQuery: false,
      });

      res.json({
        success: true,
        data: {
          items: talento.rows,
          meta: {
            page,
            limit,
            total: talento.count,
            totalPages: Math.max(1, Math.ceil(talento.count / limit)),
            hasMore: offset + talento.rows.length < talento.count,
          },
        },
      });
      return;
    }

    const talento = await PerfilEstudiante.findAll({
      where: searchWhere,
      include,
      order,
      limit,
      subQuery: false,
    });

    res.json({ success: true, data: talento });
  } catch (error) {
    responderError(res, error, 'Error al obtener talento recomendado.');
  }
};

const listarPostulaciones = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const postulaciones = await Postulacion.findAll({
      include: [
        {
          model: Propuesta,
          as: 'propuesta',
          required: true,
          where: { id_perfil_empresario: perfil.id_perfil_empresario },
        },
        {
          model: PerfilEstudiante,
          as: 'perfilEstudiante',
          include: [
            { model: Usuario, as: 'usuario' },
            { model: Curriculum, as: 'curriculum' },
            { model: HistorialProyectoEstudiante, as: 'historialProyectos' },
          ],
        },
      ],
      order: [['fecha_postulacion', 'DESC']],
      limit: obtenerLimite(req.query.limit),
    });

    res.json({ success: true, data: postulaciones });
  } catch (error) {
    responderError(res, error, 'Error al obtener las postulaciones.');
  }
};

const listarMensajesRecientes = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const conversaciones = await Conversacion.findAll({
      include: [{
        model: Postulacion,
        as: 'postulacion',
        required: true,
        include: [
          {
            model: Propuesta,
            as: 'propuesta',
            required: true,
            where: { id_perfil_empresario: perfil.id_perfil_empresario },
          },
          {
            model: PerfilEstudiante,
            as: 'perfilEstudiante',
            include: [{ model: Usuario, as: 'usuario' }],
          },
        ],
      }],
      order: [['fecha_envio', 'DESC']],
      limit: obtenerLimite(req.query.limit),
    });

    res.json({ success: true, data: conversaciones });
  } catch (error) {
    responderError(res, error, 'Error al obtener mensajes recientes.');
  }
};

const listarHistorial = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const historial = await HistorialProyectoEmpresa.findAll({
      where: { id_perfil_empresario: perfil.id_perfil_empresario },
      order: [['fecha_registro', 'DESC']],
      limit: obtenerLimite(req.query.limit),
    });

    res.json({ success: true, data: historial });
  } catch (error) {
    responderError(res, error, 'Error al obtener el historial de proyectos.');
  }
};

const listarEvaluaciones = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const evaluaciones = await Evaluacion.findAll({
      where: { id_perfil_empresario: perfil.id_perfil_empresario },
      include: [{ model: Entregable, as: 'entregable', include: [{ model: ProyectoPlataforma, as: 'proyecto' }] }],
      order: [['fecha_evaluacion', 'DESC']],
      limit: obtenerLimite(req.query.limit),
    });

    res.json({ success: true, data: evaluaciones });
  } catch (error) {
    responderError(res, error, 'Error al obtener las evaluaciones.');
  }
};

const listarPagos = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const idsPropuestas = await obtenerIdsPropuestas(perfil.id_perfil_empresario);
    const idsProyectos = await obtenerIdsProyectos(idsPropuestas);
    if (!idsProyectos.length) {
      res.json({ success: true, data: [] });
      return;
    }

    const pagos = await Pago.findAll({
      where: { id_proyecto: { [Op.in]: idsProyectos } },
      include: [{ model: ProyectoPlataforma, as: 'proyecto', include: [{ model: Propuesta, as: 'propuesta' }] }],
      order: [['fecha_pago', 'DESC']],
      limit: obtenerLimite(req.query.limit),
    });

    res.json({ success: true, data: pagos });
  } catch (error) {
    responderError(res, error, 'Error al obtener pagos.');
  }
};

const obtenerResumen = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const idsPropuestas = await obtenerIdsPropuestas(perfil.id_perfil_empresario);
    const idsProyectos = await obtenerIdsProyectos(idsPropuestas);

    const [
      proyectosPublicados,
      proyectosActivos,
      ofertasRecibidas,
      proyectosFinalizados,
      estudiantesContratados,
    ] = await Promise.all([
      Propuesta.count({ where: { id_perfil_empresario: perfil.id_perfil_empresario } }),
      Propuesta.count({ where: { id_perfil_empresario: perfil.id_perfil_empresario, estado: 'ACTIVA' } }),
      idsPropuestas.length ? Oferta.count({ where: { id_proyecto: { [Op.in]: idsPropuestas } } }) : 0,
      idsProyectos.length ? ProyectoPlataforma.count({ where: { id_proyecto: { [Op.in]: idsProyectos }, estado: 'COMPLETADO' } }) : 0,
      idsPropuestas.length ? Postulacion.count({ where: { id_propuesta: { [Op.in]: idsPropuestas }, estado: 'CONTRATADO' } }) : 0,
    ]);

    res.json({
      success: true,
      data: {
        proyectosPublicados,
        proyectosActivos,
        ofertasRecibidas,
        proyectosFinalizados,
        estudiantesContratados,
      },
    });
  } catch (error) {
    responderError(res, error, 'Error al obtener el resumen del dashboard.');
  }
};

const obtenerConversacion = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;
    const userId = req.user.id_usuario;
    const { idPostulacion } = req.params;

    const postulacion = await Postulacion.findByPk(idPostulacion, {
      include: [{ model: Propuesta, as: 'propuesta', where: { id_perfil_empresario: perfil.id_perfil_empresario } }],
    });
    if (!postulacion) return res.status(404).json({ success: false, message: 'Postulación no encontrada.' });

    const [mensajes, perfilEst] = await Promise.all([
      Conversacion.findAll({
        where: { id_postulacion: idPostulacion },
        include: [
          { model: Usuario, as: 'emisor', attributes: ['id_usuario', 'nombre', 'foto_perfil', 'rol'] },
        ],
        order: [['fecha_envio', 'ASC']],
      }),
      PerfilEstudiante.findByPk(postulacion.id_perfil_estudiante, {
        include: [{ model: Usuario, as: 'usuario', attributes: ['id_usuario', 'nombre', 'foto_perfil', 'rol'] }],
      }),
    ]);

    const contacto = perfilEst?.usuario || null;
    if (contacto) contacto.rol = 'estudiante';

    res.json({ success: true, data: { mensajes, contacto } });
  } catch (error) {
    responderError(res, error, 'Error al obtener la conversación.');
  }
};

const enviarMensaje = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;
    const userId = req.user.id_usuario;

    const { id_postulacion, mensaje } = req.body;
    if (!id_postulacion || !mensaje?.trim()) {
      return res.status(400).json({ success: false, message: 'id_postulacion y mensaje son requeridos.' });
    }

    const postulacion = await Postulacion.findByPk(id_postulacion, {
      include: [{ model: Propuesta, as: 'propuesta', where: { id_perfil_empresario: perfil.id_perfil_empresario } }],
    });
    if (!postulacion) return res.status(404).json({ success: false, message: 'Postulación no encontrada.' });

    const nuevo = await Conversacion.create({
      id_postulacion,
      id_usuario_emisor: userId,
      mensaje: mensaje.trim(),
      leido: false,
    });

    const creado = await Conversacion.findByPk(nuevo.id_conversacion, {
      include: [{ model: Usuario, as: 'emisor', attributes: ['id_usuario', 'nombre', 'foto_perfil', 'rol'] }],
    });

    res.status(201).json({ success: true, data: creado });
  } catch (error) {
    responderError(res, error, 'Error al enviar el mensaje.');
  }
};

const marcarLeidos = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;
    const userId = req.user.id_usuario;
    const { idPostulacion } = req.params;

    const postulacion = await Postulacion.findByPk(idPostulacion, {
      include: [{ model: Propuesta, as: 'propuesta', where: { id_perfil_empresario: perfil.id_perfil_empresario } }],
    });
    if (!postulacion) return res.status(404).json({ success: false, message: 'Postulación no encontrada.' });

    await Conversacion.update(
      { leido: true },
      {
        where: {
          id_postulacion: idPostulacion,
          id_usuario_emisor: { [Op.ne]: userId },
          leido: false,
        },
      }
    );

    res.json({ success: true });
  } catch (error) {
    responderError(res, error, 'Error al marcar mensajes como leídos.');
  }
};

const listarOfertasEmpleo = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;
    const ofertas = await OfertaEmpleo.findAll({
      where: { id_perfil_empresario: perfil.id_perfil_empresario },
      order: ORDEN_DESC,
      limit: obtenerLimite(req.query.limit),
    });
    res.json({ success: true, data: ofertas });
  } catch (error) {
    responderError(res, error, 'Error al obtener las ofertas de empleo.');
  }
};

const crearOfertaEmpleo = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEmpresario(req, res);
    if (!perfil) return;

    const { titulo, descripcion, requisitos, tecnologias_requeridas,
            tipo_jornada, modalidad, salario_min, salario_max, ubicacion } = req.body;

    if (!titulo || !descripcion) {
      return res.status(400).json({ success: false, message: 'Título y descripción son obligatorios.' });
    }
    if (salario_min && salario_max && Number(salario_min) > Number(salario_max)) {
      return res.status(400).json({ success: false, message: 'El salario mínimo no puede ser mayor al máximo.' });
    }

    const oferta = await OfertaEmpleo.create({
      id_perfil_empresario: perfil.id_perfil_empresario,
      titulo, descripcion, requisitos, tecnologias_requeridas,
      tipo_jornada: tipo_jornada || 'tiempo_completo',
      modalidad: modalidad || 'remoto',
      salario_min: salario_min || null,
      salario_max: salario_max || null,
      ubicacion: ubicacion || null,
      estado: 'ACTIVA',
    });
    res.status(201).json({ success: true, data: oferta });
  } catch (error) {
    responderError(res, error, 'Error al crear la oferta de empleo.');
  }
};

module.exports = {
  actualizarPerfil,
  actualizarPropuesta,
  crearOfertaEmpleo,
  crearPropuesta,
  eliminarPropuesta,
  enviarMensaje,
  listarEntregables,
  listarEvaluaciones,
  listarHistorial,
  listarMensajesRecientes,
  listarNotificaciones,
  listarOfertas,
  listarOfertasEmpleo,
  listarPagos,
  listarPerfil,
  listarPostulaciones,
  listarPropuestas,
  listarTalento,
  marcarLeidos,
  obtenerConversacion,
  obtenerResumen,
  subirFotoPerfil,
  aceptarOferta,
  rechazarOferta,
  };

