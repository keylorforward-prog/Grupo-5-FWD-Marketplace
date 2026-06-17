const { Op } = require('sequelize');
const {
  Conversacion,
  Curriculum,
  Entregable,
  Evaluacion,
  HistorialProyectoEmpresa,
  Notificacion,
  Oferta,
  Pago,
  PerfilEmpresario,
  PerfilEstudiante,
  Postulacion,
  Propuesta,
  ProyectoPlataforma,
  Usuario,
} = require('../Models');

const ORDEN_DESC = [['fecha_publicacion', 'DESC']];
const PRESUPUESTO_MINIMO_PROYECTO = 100000;

const obtenerLimite = (valor, defecto = 20) => {
  const numero = Number.parseInt(valor, 10);
  if (Number.isNaN(numero) || numero <= 0) return defecto;
  return Math.min(numero, 100);
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
    const presupuestoMin = req.body.presupuesto_min === null || req.body.presupuesto_min === undefined
      ? null
      : Number(req.body.presupuesto_min);
    const presupuestoMax = req.body.presupuesto_max === null || req.body.presupuesto_max === undefined
      ? null
      : Number(req.body.presupuesto_max);

    if (!presupuestoMin || presupuestoMin < PRESUPUESTO_MINIMO_PROYECTO) {
      res.status(400).json({
        success: false,
        message: 'El presupuesto minimo debe ser de al menos ₡100.000.',
      });
      return;
    }

    if (presupuestoMax !== null && presupuestoMin > presupuestoMax) {
      res.status(400).json({
        success: false,
        message: 'El presupuesto minimo no puede ser mayor al presupuesto maximo.',
      });
      return;
    }

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
    });

    res.status(201).json({ success: true, data: propuesta });
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

    const idsPropuestas = await obtenerIdsPropuestas(perfil.id_perfil_empresario);
    if (!idsPropuestas.length) {
      res.json({ success: true, data: [] });
      return;
    }

    const where = { id_proyecto: { [Op.in]: idsPropuestas } };
    if (req.query.estado === 'pendientes') where.estado = null;

    const ofertas = await Oferta.findAll({
      where,
      include: [
        { model: Propuesta, as: 'propuestaRef' },
        {
          model: PerfilEstudiante,
          as: 'perfilEstudiante',
          include: [
            { model: Usuario, as: 'usuario' },
            { model: Curriculum, as: 'curriculum' },
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
    const talento = await PerfilEstudiante.findAll({
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Curriculum, as: 'curriculum' },
        { model: Postulacion, as: 'postulaciones' },
      ],
      order: [['reputacion_total', 'DESC'], ['fecha_verificacion', 'DESC']],
      limit: obtenerLimite(req.query.limit),
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

module.exports = {
  actualizarPerfil,
  actualizarPropuesta,
  crearPropuesta,
  eliminarPropuesta,
  enviarMensaje,
  listarEntregables,
  listarEvaluaciones,
  listarHistorial,
  listarMensajesRecientes,
  listarNotificaciones,
  listarOfertas,
  listarPagos,
  listarPerfil,
  listarPostulaciones,
  listarPropuestas,
  listarTalento,
  marcarLeidos,
  obtenerConversacion,
  obtenerResumen,
  subirFotoPerfil,
};
