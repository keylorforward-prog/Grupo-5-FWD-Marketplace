const { Op } = require('sequelize');
const {
  PerfilEstudiante,
  Postulacion,
  Propuesta,
  ProyectoPlataforma,
  Entregable,
  HistorialProyectoEstudiante,
  Notificacion,
  Oferta,
  Usuario,
} = require('../Models');

const obtenerLimite = (valor, defecto = 20) => {
  const numero = Number.parseInt(valor, 10);
  if (Number.isNaN(numero) || numero <= 0) return defecto;
  return Math.min(numero, 100);
};

const obtenerPerfilEstudiante = async (req, res) => {
  const perfil = await PerfilEstudiante.findOne({
    where: { id_usuario: req.user.id_usuario },
    include: [{ model: Usuario, as: 'usuario' }],
  });

  if (!perfil) {
    res.status(404).json({
      success: false,
      message: 'No existe un PerfilEstudiante para el usuario autenticado.',
    });
    return null;
  }

  return perfil;
};

const responderError = (res, error, mensaje) => {
  console.error(mensaje, error);
  res.status(500).json({ success: false, message: mensaje });
};

const listarPerfil = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;
    res.json({ success: true, data: perfil });
  } catch (error) {
    responderError(res, error, 'Error al obtener el perfil estudiante.');
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;

    await perfil.update(req.body);
    const actualizado = await PerfilEstudiante.findByPk(perfil.id_perfil_estudiante, {
      include: [{ model: Usuario, as: 'usuario' }],
    });

    res.json({ success: true, data: actualizado });
  } catch (error) {
    responderError(res, error, 'Error al actualizar el perfil estudiante.');
  }
};

const obtenerResumen = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;

    const [
      postulacionesActivas,
      postulacionesTotales,
      proyectosEnProgreso,
      proyectosCompletados,
      ofertasRecibidas,
      notificacionesNoLeidas,
    ] = await Promise.all([
      Postulacion.count({
        where: {
          id_perfil_estudiante: perfil.id_perfil_estudiante,
          estado: { [Op.in]: ['ENVIADA', 'EN_REVISION', 'PRESELECCIONADA'] },
        },
      }),
      Postulacion.count({ where: { id_perfil_estudiante: perfil.id_perfil_estudiante } }),
      ProyectoPlataforma.count({
        include: [{
          model: Propuesta,
          as: 'propuesta',
          required: true,
          include: [{
            model: Postulacion,
            as: 'postulaciones',
            required: true,
            where: { id_perfil_estudiante: perfil.id_perfil_estudiante },
          }],
        }],
        where: { estado: { [Op.in]: ['EN_PROGRESO', 'EN_REVISION'] } },
      }),
      ProyectoPlataforma.count({
        include: [{
          model: Propuesta,
          as: 'propuesta',
          required: true,
          include: [{
            model: Postulacion,
            as: 'postulaciones',
            required: true,
            where: { id_perfil_estudiante: perfil.id_perfil_estudiante },
          }],
        }],
        where: { estado: 'COMPLETADO' },
      }),
      Oferta.count({ where: { id_perfil_estudiante: perfil.id_perfil_estudiante } }),
      Notificacion.count({ where: { id_usuario: req.user.id_usuario, leido: false } }),
    ]);

    res.json({
      success: true,
      data: {
        reputacion: perfil.reputacion_total,
        postulacionesActivas,
        postulacionesTotales,
        proyectosEnProgreso,
        proyectosCompletados,
        ofertasRecibidas,
        notificacionesNoLeidas,
      },
    });
  } catch (error) {
    responderError(res, error, 'Error al obtener el resumen del dashboard.');
  }
};

const listarPostulaciones = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;

    const postulaciones = await Postulacion.findAll({
      where: { id_perfil_estudiante: perfil.id_perfil_estudiante },
      include: [
        {
          model: Propuesta,
          as: 'propuesta',
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

const listarProyectos = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;

    const proyectos = await ProyectoPlataforma.findAll({
      include: [
        {
          model: Propuesta,
          as: 'propuesta',
          required: true,
          include: [{
            model: Postulacion,
            as: 'postulaciones',
            required: true,
            where: { id_perfil_estudiante: perfil.id_perfil_estudiante },
          }],
        },
        { model: Entregable, as: 'entregables' },
      ],
      order: [['fecha_creacion', 'DESC']],
      limit: obtenerLimite(req.query.limit),
    });

    res.json({ success: true, data: proyectos });
  } catch (error) {
    responderError(res, error, 'Error al obtener los proyectos.');
  }
};

const listarHistorial = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;

    const historial = await HistorialProyectoEstudiante.findAll({
      where: { id_perfil_estudiante: perfil.id_perfil_estudiante },
      order: [['fecha_registro', 'DESC']],
      limit: obtenerLimite(req.query.limit),
    });

    res.json({ success: true, data: historial });
  } catch (error) {
    responderError(res, error, 'Error al obtener el historial.');
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

const listarMensajesRecientes = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;

    const { Conversacion } = require('../Models');
    const conversaciones = await Conversacion.findAll({
      include: [{
        model: Postulacion,
        as: 'postulacion',
        required: true,
        where: { id_perfil_estudiante: perfil.id_perfil_estudiante },
        include: [
          { model: Propuesta, as: 'propuesta' },
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

module.exports = {
  actualizarPerfil,
  listarHistorial,
  listarMensajesRecientes,
  listarNotificaciones,
  listarPerfil,
  listarPostulaciones,
  listarProyectos,
  obtenerResumen,
};
