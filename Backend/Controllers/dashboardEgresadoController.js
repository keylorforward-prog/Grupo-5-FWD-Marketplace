const { Op, fn, col } = require('sequelize');
const {
  PerfilEstudiante,
  PerfilEmpresario,
  Postulacion,
  Propuesta,
  ProyectoPlataforma,
  Entregable,
  HistorialProyectoEstudiante,
  Notificacion,
  Oferta,
  Usuario,
  Conversacion,
  Curriculum,
} = require('../Models');

const obtenerLimite = (valor, defecto = 20) => {
  const numero = Number.parseInt(valor, 10);
  if (Number.isNaN(numero) || numero <= 0) return defecto;
  return Math.min(numero, 100);
};

const obtenerPerfilEstudiante = async (req, res) => {
  const perfil = await PerfilEstudiante.findOne({
    where: { id_usuario: req.user.id_usuario },
    include: [
      { model: Usuario, as: 'usuario' },
      { model: Curriculum, as: 'curriculum' },
    ],
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

    const usuario = perfil.usuario || {};
    const curriculum = perfil.curriculum || {};

    const tecnologias = curriculum.habilidades
      ? curriculum.habilidades.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    let enlaces = {};
    try {
      enlaces = curriculum.enlaces ? JSON.parse(curriculum.enlaces) : {};
    } catch { enlaces = {}; }

    res.json({
      success: true,
      data: {
        nombre: usuario.nombre || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono_whatsapp || '',
        foto_perfil: usuario.foto_perfil || usuario.avatar_url || null,
        titulo_fwd: perfil.titulo_fwd || '',
        descripcion: perfil.descripcion || '',
        sede_graduacion: perfil.sede_graduacion || '',
        reputacion_total: perfil.reputacion_total || null,
        tecnologias,
        portfolio: enlaces.portfolio || '',
        linkedin: enlaces.linkedin || '',
        educacion: curriculum.educacion ? JSON.parse(curriculum.educacion) : [],
        experiencia: curriculum.experiencia_laboral ? JSON.parse(curriculum.experiencia_laboral) : [],
        resumen_profesional: curriculum.resumen_profesional || '',
        certificaciones: curriculum.certificaciones || '',
        documento_cv: curriculum.documento_cv || null,
      },
    });
  } catch (error) {
    responderError(res, error, 'Error al obtener el perfil estudiante.');
  }
};

const actualizarPerfil = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;

    const usuario = perfil.usuario || {};

    const { nombre, foto_perfil, avatar, rol, bio, tecnologias, portfolio, linkedin, telefono, educacion, experiencia, resumen_profesional, certificaciones, documento_cv_url } = req.body;

    const fotoFinal = foto_perfil ?? avatar;
    if (nombre !== undefined || fotoFinal !== undefined || telefono !== undefined) {
      const usuarioUpdate = {};
      if (nombre !== undefined) usuarioUpdate.nombre = nombre;
      if (fotoFinal !== undefined) usuarioUpdate.foto_perfil = fotoFinal;
      if (telefono !== undefined) usuarioUpdate.telefono_whatsapp = telefono;
      await Usuario.update(usuarioUpdate, { where: { id_usuario: req.user.id_usuario } });
    }

    const perfilUpdate = {};
    if (rol !== undefined) perfilUpdate.titulo_fwd = rol;
    if (bio !== undefined) perfilUpdate.descripcion = bio;
    if (Object.keys(perfilUpdate).length > 0) {
      await perfil.update(perfilUpdate);
    }

    let curriculum = perfil.curriculum;
    if (!curriculum) {
      curriculum = await Curriculum.create({ id_perfil_estudiante: perfil.id_perfil_estudiante });
    }

    const curriculumUpdate = {};
    if (tecnologias !== undefined) {
      curriculumUpdate.habilidades = Array.isArray(tecnologias)
        ? tecnologias.map((t) => (typeof t === 'string' ? t : t.nombre)).join(',')
        : '';
    }
    if (portfolio !== undefined || linkedin !== undefined) {
      let enlacesActuales = {};
      try { enlacesActuales = curriculum.enlaces ? JSON.parse(curriculum.enlaces) : {}; } catch { enlacesActuales = {}; }
      if (portfolio !== undefined) enlacesActuales.portfolio = portfolio;
      if (linkedin !== undefined) enlacesActuales.linkedin = linkedin;
      curriculumUpdate.enlaces = JSON.stringify(enlacesActuales);
    }
    if (educacion !== undefined) {
      curriculumUpdate.educacion = JSON.stringify(educacion);
    }
    if (experiencia !== undefined) {
      curriculumUpdate.experiencia_laboral = JSON.stringify(experiencia);
    }
    if (resumen_profesional !== undefined) {
      curriculumUpdate.resumen_profesional = resumen_profesional;
    }
    if (certificaciones !== undefined) {
      curriculumUpdate.certificaciones = JSON.stringify(certificaciones);
    }
    if (documento_cv_url !== undefined) {
      curriculumUpdate.documento_cv = documento_cv_url;
    }
    if (Object.keys(curriculumUpdate).length > 0) {
      curriculumUpdate.fecha_actualizacion = new Date();
      await Curriculum.update(curriculumUpdate, { where: { id_curriculum: curriculum.id_curriculum } });
    }

    const actualizado = await PerfilEstudiante.findByPk(perfil.id_perfil_estudiante, {
      include: [
        { model: Usuario, as: 'usuario' },
        { model: Curriculum, as: 'curriculum' },
      ],
    });

    res.json({ success: true, data: actualizado });
  } catch (error) {
    responderError(res, error, 'Error al actualizar el perfil estudiante.');
  }
};

const subirDocumentoCv = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;

    if (!req.file) {
      res.status(400).json({ success: false, message: 'Debes enviar un archivo en el campo documento_cv.' });
      return;
    }

    const { uploadFileToS3 } = require('../Config/aws');
    const urlDocumento = await uploadFileToS3(req.file, 'documentos_cv');

    let curriculum = perfil.curriculum;
    if (!curriculum) {
      curriculum = await Curriculum.create({ id_perfil_estudiante: perfil.id_perfil_estudiante });
    }

    await Curriculum.update(
      { documento_cv: urlDocumento, fecha_actualizacion: new Date() },
      { where: { id_curriculum: curriculum.id_curriculum } }
    );

    res.json({ success: true, data: { documento_cv: urlDocumento } });
  } catch (error) {
    responderError(res, error, 'Error al subir el documento CV.');
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
          estado: { [Op.in]: ['ENVIADA', 'EN_REVISION', 'PRESSELECCIONADA'] },
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
          include: [{
            model: PerfilEmpresario,
            as: 'perfilEmpresario',
            include: [{
              model: Usuario,
              as: 'usuario',
              attributes: ['nombre'],
            }],
          }],
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
          include: [
            {
              model: Postulacion,
              as: 'postulaciones',
              required: true,
              where: { id_perfil_estudiante: perfil.id_perfil_estudiante },
            },
            {
              model: PerfilEmpresario,
              as: 'perfilEmpresario',
              include: [{ model: Usuario, as: 'usuario', attributes: ['nombre', 'foto_perfil'] }],
            },
          ],
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

const crearHistorial = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;

    const { titulo_proyecto, descripcion, enlace, tecnologias, rol_desempenado, fecha_inicio, fecha_fin } = req.body;

    if (!titulo_proyecto || !titulo_proyecto.trim()) {
      return res.status(400).json({ success: false, message: 'El título del proyecto es obligatorio.' });
    }

    const historial = await HistorialProyectoEstudiante.create({
      id_perfil_estudiante: perfil.id_perfil_estudiante,
      titulo_proyecto: titulo_proyecto.trim(),
      tipo: 'GITHUB',
      descripcion: descripcion || '',
      enlace: enlace || '',
      tecnologias: tecnologias || '',
      rol_desempenado: rol_desempenado || '',
      fecha_inicio: fecha_inicio || null,
      fecha_fin: fecha_fin || null,
    });

    res.status(201).json({ success: true, data: historial });
  } catch (error) {
    responderError(res, error, 'Error al crear el proyecto.');
  }
};

const actualizarHistorial = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;

    const { id } = req.params;
    const historial = await HistorialProyectoEstudiante.findOne({
      where: { id_historial_estudiante: id, id_perfil_estudiante: perfil.id_perfil_estudiante },
    });

    if (!historial) {
      return res.status(404).json({ success: false, message: 'Proyecto no encontrado.' });
    }

    const { titulo_proyecto, descripcion, enlace, tecnologias, rol_desempenado, fecha_inicio, fecha_fin } = req.body;

    await historial.update({
      titulo_proyecto: titulo_proyecto !== undefined ? titulo_proyecto.trim() : historial.titulo_proyecto,
      descripcion: descripcion !== undefined ? descripcion : historial.descripcion,
      enlace: enlace !== undefined ? enlace : historial.enlace,
      tecnologias: tecnologias !== undefined ? tecnologias : historial.tecnologias,
      rol_desempenado: rol_desempenado !== undefined ? rol_desempenado : historial.rol_desempenado,
      fecha_inicio: fecha_inicio !== undefined ? fecha_inicio : historial.fecha_inicio,
      fecha_fin: fecha_fin !== undefined ? fecha_fin : historial.fecha_fin,
    });

    res.json({ success: true, data: historial });
  } catch (error) {
    responderError(res, error, 'Error al actualizar el proyecto.');
  }
};

const eliminarHistorial = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;

    const { id } = req.params;
    const historial = await HistorialProyectoEstudiante.findOne({
      where: { id_historial_estudiante: id, id_perfil_estudiante: perfil.id_perfil_estudiante },
    });

    if (!historial) {
      return res.status(404).json({ success: false, message: 'Proyecto no encontrado.' });
    }

    await historial.destroy();
    res.json({ success: true, message: 'Proyecto eliminado correctamente.' });
  } catch (error) {
    responderError(res, error, 'Error al eliminar el proyecto.');
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
    const userId = req.user.id_usuario;

    const includePostulacion = {
      model: Postulacion,
      as: 'postulacion',
      required: true,
      include: [{
        model: Propuesta,
        as: 'propuesta',
        include: [{
          model: PerfilEmpresario,
          as: 'perfilEmpresario',
          include: [{
            model: Usuario,
            as: 'usuario',
            attributes: ['id_usuario', 'nombre', 'cedula', 'foto_perfil', 'rol'],
          }],
        }],
      }],
    };

    const recibidos = await Conversacion.findAll({
      include: [{
        ...includePostulacion,
        where: { id_perfil_estudiante: perfil.id_perfil_estudiante },
      }, {
        model: Usuario, as: 'emisor', attributes: ['id_usuario', 'nombre', 'foto_perfil'],
      }],
      order: [['fecha_envio', 'DESC']],
    });

    const enviados = await Conversacion.findAll({
      where: { id_usuario_emisor: userId },
      include: [includePostulacion, {
        model: Usuario, as: 'emisor', attributes: ['id_usuario', 'nombre', 'foto_perfil'],
      }],
      order: [['fecha_envio', 'DESC']],
    });

    const todas = [...recibidos, ...enviados];
    const agrupadas = Object.values(
      todas.reduce((acc, c) => {
        const key = c.id_postulacion;
        if (!acc[key] || new Date(c.fecha_envio) > new Date(acc[key].fecha_envio)) {
          const empresario = c.postulacion?.propuesta?.perfilEmpresario?.usuario || null;
          if (empresario) empresario.rol = 'empresa';
          const contacto = empresario || null;
          acc[key] = { ...c.toJSON ? c.toJSON() : c, contacto };
        }
        return acc;
      }, {})
    ).slice(0, obtenerLimite(req.query.limit));

    res.json({ success: true, data: agrupadas });
  } catch (error) {
    responderError(res, error, 'Error al obtener mensajes recientes.');
  }
};

const obtenerConversacion = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;
    const userId = req.user.id_usuario;

    const { idPostulacion } = req.params;

    const postulacion = await Postulacion.findByPk(idPostulacion, {
      include: [{ model: Propuesta, as: 'propuesta' }],
    });
    if (!postulacion) return res.status(404).json({ success: false, message: 'Postulación no encontrada.' });

    const esEstudiante = postulacion.id_perfil_estudiante === perfil.id_perfil_estudiante;
    const esEmpresario = postulacion.propuesta?.id_usuario === userId;
    const participa = await Conversacion.findOne({
      where: { id_postulacion: idPostulacion, id_usuario_emisor: userId },
    });

    if (!esEstudiante && !esEmpresario && !participa) {
      return res.status(403).json({ success: false, message: 'No tienes acceso a esta conversación.' });
    }

    const [mensajes, postulacionCompleta] = await Promise.all([
      Conversacion.findAll({
        where: { id_postulacion: idPostulacion },
        include: [
          { model: Usuario, as: 'emisor', attributes: ['id_usuario', 'nombre', 'foto_perfil', 'rol'] },
        ],
        order: [['fecha_envio', 'ASC']],
      }),
      Postulacion.findByPk(idPostulacion, {
        include: [{
          model: Propuesta,
          as: 'propuesta',
          include: [{
            model: PerfilEmpresario,
            as: 'perfilEmpresario',
            include: [{ model: Usuario, as: 'usuario', attributes: ['id_usuario', 'nombre', 'foto_perfil', 'rol'] }],
          }],
        }],
      }),
    ]);

    const empresario = postulacionCompleta?.propuesta?.perfilEmpresario?.usuario || null;
    if (empresario) empresario.rol = 'empresa';

    res.json({ success: true, data: { mensajes, contacto: empresario } });
  } catch (error) {
    responderError(res, error, 'Error al obtener la conversación.');
  }
};

const enviarMensaje = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;
    const userId = req.user.id_usuario;

    const { id_postulacion, mensaje } = req.body;
    if (!id_postulacion || !mensaje?.trim()) {
      return res.status(400).json({ success: false, message: 'id_postulacion y mensaje son requeridos.' });
    }

    const postulacion = await Postulacion.findByPk(id_postulacion, {
      include: [{ model: Propuesta, as: 'propuesta' }],
    });
    if (!postulacion) return res.status(404).json({ success: false, message: 'Postulación no encontrada.' });

    const esEstudiante = postulacion.id_perfil_estudiante === perfil.id_perfil_estudiante;
    const esEmpresario = postulacion.propuesta?.id_usuario === userId;

    if (!esEstudiante && !esEmpresario) {
      return res.status(403).json({ success: false, message: 'No tienes acceso a esta conversación.' });
    }

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
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;
    const userId = req.user.id_usuario;
    const { idPostulacion } = req.params;

    const postulacion = await Postulacion.findByPk(idPostulacion, {
      include: [{ model: Propuesta, as: 'propuesta' }],
    });
    if (!postulacion) return res.status(404).json({ success: false, message: 'Postulación no encontrada.' });

    const esEstudiante = postulacion.id_perfil_estudiante === perfil.id_perfil_estudiante;
    const esEmpresario = postulacion.propuesta?.id_usuario === userId;
    if (!esEstudiante && !esEmpresario) {
      return res.status(403).json({ success: false, message: 'No tienes acceso a esta conversación.' });
    }

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

const listarOfertas = async (req, res) => {
  try {
    const perfil = await obtenerPerfilEstudiante(req, res);
    if (!perfil) return;

    const ofertas = await Oferta.findAll({
      where: { id_perfil_estudiante: perfil.id_perfil_estudiante },
      include: [{
        model: Propuesta,
        as: 'propuestaRef',
        include: [{
          model: PerfilEmpresario,
          as: 'perfilEmpresario',
          include: [{ model: Usuario, as: 'usuario' }],
        }],
      }],
      order: [['fecha_oferta', 'DESC']],
      limit: obtenerLimite(req.query.limit),
    });

    res.json({ success: true, data: ofertas });
  } catch (error) {
    responderError(res, error, 'Error al obtener las ofertas.');
  }
};

const marcarNotificacionLeida = async (req, res) => {
  try {
    const [updated] = await Notificacion.update(
      { leido: true },
      { where: { id_notificacion: req.params.id, id_usuario: req.user.id_usuario } }
    );
    if (!updated) return res.status(404).json({ success: false, message: 'Notificación no encontrada.' });
    res.json({ success: true });
  } catch (error) {
    responderError(res, error, 'Error al marcar notificación como leída.');
  }
};

const marcarTodasNotificacionesLeidas = async (req, res) => {
  try {
    await Notificacion.update(
      { leido: true },
      { where: { id_usuario: req.user.id_usuario, leido: false } }
    );
    res.json({ success: true });
  } catch (error) {
    responderError(res, error, 'Error al marcar notificaciones como leídas.');
  }
};

module.exports = {
  actualizarPerfil,
  subirDocumentoCv,
  crearHistorial,
  actualizarHistorial,
  eliminarHistorial,
  listarHistorial,
  listarMensajesRecientes,
  listarOfertas,
  obtenerConversacion,
  enviarMensaje,
  marcarLeidos,
  marcarNotificacionLeida,
  marcarTodasNotificacionesLeidas,
  listarNotificaciones,
  listarPerfil,
  listarPostulaciones,
  listarProyectos,
  obtenerResumen,
};
