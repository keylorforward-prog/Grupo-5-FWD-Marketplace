const AVATAR_DEFECTO = '/Imgs/Logotipo/Digital/Sintesis/FWD - Sintesis-01.png';
const FLECHAS_PROYECTO = [
  '/Imgs/FLECHAS/Flechas-01.png',
  '/Imgs/FLECHAS/Flechas-02.png',
  '/Imgs/FLECHAS/Flechas-03.png',
  '/Imgs/FLECHAS/Flechas-04.png',
  '/Imgs/FLECHAS/Flechas-05.png',
  '/Imgs/FLECHAS/Flechas-06.png',
  '/Imgs/FLECHAS/Flechas-07.png',
  '/Imgs/FLECHAS/Flechas-08.png',
];

const esUrl = (valor) => /^https?:\/\//i.test(valor || '');

const formatearFechaRelativa = (fecha) => {
  if (!fecha) return 'Sin fecha';
  const diferencia = Date.now() - new Date(fecha).getTime();
  const minutos = Math.max(1, Math.round(diferencia / 60000));
  if (minutos < 60) return `Hace ${minutos} min`;
  const horas = Math.round(minutos / 60);
  if (horas < 24) return `Hace ${horas} h`;
  const dias = Math.round(horas / 24);
  return `Hace ${dias} dias`;
};

const estadoPropuesta = (estado) => {
  const mapa = {
    ACTIVA: ['En recepcion de ofertas', 'recepcion'],
    PAUSADA: ['Pausada', 'pendiente'],
    CERRADA: ['Cerrada', 'finalizado'],
    CANCELADA: ['Cancelada', 'revision'],
  };
  return mapa[estado] ?? [estado || 'Sin estado', 'pendiente'];
};

const estadoProyecto = (estado) => {
  const mapa = {
    ABIERTO: ['Abierto', 'recepcion'],
    EN_PROGRESO: ['En desarrollo', 'desarrollo'],
    EN_REVISION: ['En revision', 'revision'],
    COMPLETADO: ['Finalizado', 'finalizado'],
    CANCELADO: ['Cancelado', 'revision'],
  };
  return mapa[estado] ?? estadoPropuesta(estado);
};

export const formatearPropuesta = (propuesta, indice = 0) => {
  const [status, statusType] = propuesta.proyecto
    ? estadoProyecto(propuesta.proyecto.estado)
    : estadoPropuesta(propuesta.estado);
  const ofertas = propuesta.ofertas?.length ?? 0;
  const postulaciones = propuesta.postulaciones?.length ?? 0;
  const partesMeta = [
    `${ofertas} ofertas recibidas`,
    `${postulaciones} postulaciones`,
    propuesta.fecha_limite ? `Limite ${new Date(propuesta.fecha_limite).toLocaleDateString()}` : null,
  ].filter(Boolean);

  return {
    id: propuesta.id_propuesta,
    name: propuesta.titulo,
    status,
    statusType,
    meta: partesMeta.join(' - '),
    action: ofertas > 0 ? 'Ver ofertas' : 'Gestionar',
    arrowSrc: FLECHAS_PROYECTO[indice % FLECHAS_PROYECTO.length],
    iconColor: ['blue', 'orange', 'green', 'purple'][indice % 4],
    github_url: propuesta.github_url || null,
    descripcion: propuesta.descripcion,
    tecnologias_requeridas: propuesta.tecnologias_requeridas,
    presupuesto_min: propuesta.presupuesto_min,
    presupuesto_max: propuesta.presupuesto_max,
    plazo_dias: propuesta.plazo_dias,
    estado: propuesta.estado,
    fecha_limite: propuesta.fecha_limite,
  };
};

export const formatearTalento = (perfil) => {
  const usuario = perfil.usuario ?? {};
  const curriculum = perfil.curriculum ?? {};
  const rating = Number(perfil.reputacion_total ?? 0);
  const historialProyectos = perfil.historialProyectos ?? [];
  const tituloFwd = perfil.titulo_fwd || '';
  const evidenciaFwd = esUrl(tituloFwd) ? tituloFwd : null;
  const habilidades = curriculum.habilidades || (!evidenciaFwd ? tituloFwd : '');

  return {
    id: perfil.id_perfil_estudiante,
    name: usuario.nombre || 'Estudiante FWD',
    avatar: usuario.foto_perfil || AVATAR_DEFECTO,
    verified: perfil.estado_verificacion === 'VERIFICADO',
    skills: habilidades || 'Sin habilidades registradas',
    rating: rating ? rating.toFixed(1) : '0.0',
    projects: historialProyectos.length || perfil.postulaciones?.length || 0,
    match: rating ? Math.min(100, Math.round(rating * 20)) : 0,
    email: usuario.correo,
    phone: perfil.telefono_whatsapp || usuario.telefono_whatsapp,
    location: perfil.sede_graduacion || 'Sede no registrada',
    titleFwd: tituloFwd,
    evidenceFwd: evidenciaFwd,
    bio: perfil.descripcion || curriculum.resumen_profesional || curriculum.experiencia_laboral || 'Sin descripcion registrada.',
    curriculum,
    historialProyectos,
    raw: perfil,
  };
};

export const formatearOferta = (oferta) => {
  const estudiante = oferta.perfilEstudiante?.usuario;
  const estado = oferta.estado || 'PENDIENTE';
  return {
    id: oferta.id_oferta,
    title: oferta.propuestaRef?.titulo || 'Oferta recibida',
    sender: estudiante?.nombre || 'Estudiante FWD',
    email: estudiante?.correo,
    amount: Number(oferta.cantidad || 0),
    description: oferta.propuesta,
    time: formatearFechaRelativa(oferta.fecha_oferta),
    status: estado,
    pending: estado === 'PENDIENTE',
    candidate: oferta.perfilEstudiante ? formatearTalento(oferta.perfilEstudiante) : null,
  };
};

export const formatearEntregable = (entregable) => ({
  id: entregable.id_entregable,
  name: entregable.titulo,
  meta: entregable.proyecto?.titulo || entregable.descripcion || 'Sin proyecto asociado',
  status: entregable.estado,
});

export const formatearMensaje = (conversacion) => {
  const estudiante = conversacion.postulacion?.perfilEstudiante?.usuario;
  return {
    id: conversacion.id_conversacion,
    name: estudiante?.nombre || 'Conversacion',
    avatar: estudiante?.foto_perfil || AVATAR_DEFECTO,
    preview: conversacion.mensaje,
    time: formatearFechaRelativa(conversacion.fecha_envio),
    unread: !conversacion.leido,
  };
};

export const formatearNotificacion = (notificacion) => ({
  id: notificacion.id_notificacion,
  text: notificacion.mensaje,
  time: formatearFechaRelativa(notificacion.fecha),
  icon: notificacion.leido ? 'OK' : 'N',
  iconType: notificacion.leido ? 'green' : 'blue',
});

export const formatearHistorial = (historial, indice = 0) => ({
  id: historial.id_historial_empresa,
  name: historial.titulo_proyecto,
  meta: historial.tecnologias_usadas || historial.descripcion || 'Sin detalles registrados',
  status: historial.fecha_fin ? 'Finalizado' : 'En historial',
  statusType: historial.fecha_fin ? 'finalizado' : 'recepcion',
  arrowSrc: FLECHAS_PROYECTO[indice % FLECHAS_PROYECTO.length],
  iconColor: ['blue', 'orange', 'green', 'purple'][indice % 4],
});

export const formatearEvaluacion = (evaluacion) => ({
  id: evaluacion.id_evaluacion,
  name: evaluacion.entregable?.titulo || 'Evaluacion',
  skills: evaluacion.comentario || evaluacion.entregable?.proyecto?.titulo || 'Sin comentario',
  rating: evaluacion.puntuacion,
  avatar: AVATAR_DEFECTO,
});

export const formatearPago = (pago) => ({
  id: pago.id_pago,
  concept: pago.proyecto?.titulo || 'Pago de proyecto',
  amount: `$${Number(pago.monto ?? 0).toFixed(2)}`,
  status: pago.estado,
});

const estadoPostulacion = (estado) => {
  const mapa = {
    ENVIADA: 'nuevo',
    enviada: 'nuevo',
    vista: 'nuevo',
    PENDIENTE: 'pendiente',
    EN_REVISION: 'en_revision',
    PRESSELECCIONADA: 'entrevistado',
    PRESELECCIONADA: 'entrevistado',
    RECHAZADA: 'rechazado',
    rechazada: 'rechazado',
    CONTRATADO: 'entrevistado',
    ACEPTADO: 'aceptado',
    aceptada: 'aceptado',
  };
  return mapa[estado] ?? 'nuevo';
};

export const formatearPostulacion = (postulacion) => {
  const perfil = postulacion.perfilEstudiante ?? {};
  const usuario = perfil.usuario ?? {};
  const curriculum = perfil.curriculum ?? {};
  const tecnologias = (curriculum.habilidades || postulacion.propuesta?.tecnologias_requeridas || '')
    .split(',')
    .map((tecnologia) => tecnologia.trim())
    .filter(Boolean);

  return {
    id: postulacion.id_postulacion,
    name: usuario.nombre || 'Candidato FWD',
    avatar: usuario.foto_perfil || AVATAR_DEFECTO,
    location: perfil.sede_graduacion || 'Ubicacion no registrada',
    stacks: tecnologias,
    coverLetter: postulacion.mensaje_presentacion || 'Sin carta de presentacion registrada.',
    status: estadoPostulacion(postulacion.estado),
    estaInvitado: postulacion.estado === 'PRESSELECCIONADA' || postulacion.estado === 'PRESELECCIONADA' || postulacion.estado === 'CONTRATADO' || postulacion.estado === 'ACEPTADO',
    proyecto: postulacion.propuesta?.titulo || '',
    perfil: formatearTalento(perfil),
  };
};

export const formatearPostulacionEmpleo = (postulacion) => {
  const estudiante = postulacion.estudiante ?? {};
  const usuario = estudiante.usuario ?? {};
  const curriculum = estudiante.curriculum ?? {};
  const tecnologias = (curriculum.habilidades || postulacion.oferta?.tecnologias_requeridas || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    id: postulacion.id_postulacion_empleo,
    name: usuario.nombre || 'Candidato FWD',
    avatar: usuario.foto_perfil || AVATAR_DEFECTO,
    location: estudiante.sede_graduacion || 'Ubicacion no registrada',
    stacks: tecnologias,
    coverLetter: postulacion.carta_presentacion || 'Sin carta de presentacion registrada.',
    status: estadoPostulacion(postulacion.estado),
    estaInvitado: ['entrevistado', 'ACEPTADO', 'aceptada', 'PRESSELECCIONADA', 'PRESELECCIONADA', 'CONTRATADO'].includes(postulacion.estado),
    proyecto: postulacion.oferta?.titulo || postulacion.oferta?.cargo || '',
    perfil: formatearTalento(estudiante),
    esEmpleo: true,
  };
};
