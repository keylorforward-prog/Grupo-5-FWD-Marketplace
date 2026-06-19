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

const estadoPostulacion = (estado) => {
  const mapa = {
    ENVIADA: ['Enviada', 'nueva'],
    EN_REVISION: ['En Revisión', 'revision'],
    PRESSELECCIONADA: ['Preseleccionada', 'recepcion'],
    RECHAZADA: ['Rechazada', 'rechazado'],
    CONTRATADO: ['Contratado', 'finalizado'],
  };
  return mapa[estado] ?? [estado || 'Sin estado', 'pendiente'];
};

const estadoProyecto = (estado) => {
  const mapa = {
    ABIERTO: ['Abierto', 'recepcion'],
    EN_PROGRESO: ['En desarrollo', 'desarrollo'],
    EN_REVISION: ['En revisión', 'revision'],
    COMPLETADO: ['Finalizado', 'finalizado'],
    CANCELADO: ['Cancelado', 'revision'],
  };
  return mapa[estado] ?? [estado || 'Sin estado', 'pendiente'];
};

export const formatearPostulacion = (postulacion) => {
  const propuesta = postulacion.propuesta ?? {};
  const perfilEmpresario = propuesta.perfilEmpresario ?? {};
  const usuarioEmpresa = perfilEmpresario.usuario ?? {};
  const [status, statusType] = estadoPostulacion(postulacion.estado);

  return {
    id: postulacion.id_postulacion,
    idPropuesta: propuesta.id_propuesta || postulacion.id_propuesta,
    titulo: propuesta.titulo || 'Propuesta',
    descripcion: propuesta.descripcion || '',
    tecnologias: (propuesta.tecnologias_requeridas || '').split(',').map((t) => t.trim()).filter(Boolean),
    presupuesto: propuesta.presupuesto_max || propuesta.presupuesto_min || null,
    estado: status,
    estadoRaw: postulacion.estado,
    tipoEstado: statusType,
    fecha: formatearFechaRelativa(postulacion.fecha_postulacion),
    mensaje: postulacion.mensaje_presentacion,
    empresa: usuarioEmpresa.nombre || 'Empresa',
  };
};

export const formatearProyecto = (proyecto) => {
  const propuesta = proyecto.propuesta ?? {};
  const [status, statusType] = estadoProyecto(proyecto.estado);
  const entregables = proyecto.entregables ?? [];
  const empresa = propuesta.perfilEmpresario?.usuario ?? {};

  return {
    id: proyecto.id_proyecto,
    idPropuesta: propuesta.id_propuesta,
    titulo: proyecto.titulo || propuesta.titulo || 'Proyecto',
    descripcion: proyecto.descripcion || propuesta.descripcion || '',
    estado: status,
    estadoRaw: proyecto.estado,
    tipoEstado: statusType,
    entregablesCount: entregables.length,
    entregablesAprobados: entregables.filter((e) => e.estado === 'APROBADO').length,
    entregables: entregables.map((e) => ({
      id: e.id_entregable,
      titulo: e.titulo,
      tipo: e.tipo,
      estado: e.estado,
      fecha: e.fecha_creacion ? new Date(e.fecha_creacion).toLocaleDateString() : '—',
    })),
    fechaInicio: proyecto.fecha_inicio ? new Date(proyecto.fecha_inicio).toLocaleDateString() : '—',
    fechaFin: proyecto.fecha_fin_estimada ? new Date(proyecto.fecha_fin_estimada).toLocaleDateString() : '—',
    tecnologias: (propuesta.tecnologias_requeridas || '').split(',').map((t) => t.trim()).filter(Boolean),
    presupuestoMin: propuesta.presupuesto_min,
    presupuestoMax: propuesta.presupuesto_max,
    modalidad: propuesta.modalidad || 'remoto',
    empresa: empresa.nombre || 'Empresa',
    empresaFoto: empresa.foto_perfil || null,
    github_url: propuesta.github_url || null,
  };
};

const TIPO_ICONO = {
  postulacion: 'blue',
  proyecto: 'purple',
  mensaje: 'green',
  sistema: 'orange',
  oferta: 'green',
};

export const formatearNotificacion = (notificacion) => ({
  id: notificacion.id_notificacion,
  tipo: notificacion.tipo || 'sistema',
  texto: notificacion.mensaje,
  tiempo: formatearFechaRelativa(notificacion.fecha),
  fecha: notificacion.fecha,
  leido: notificacion.leido,
  tipoIcono: notificacion.leido ? 'green' : (TIPO_ICONO[notificacion.tipo] || 'blue'),
});

export const formatearMensaje = (conversacion) => {
  const postulacion = conversacion.postulacion ?? {};
  const propuesta = postulacion.propuesta ?? {};
  return {
    id: conversacion.id_conversacion,
    proyecto: propuesta.titulo || 'Proyecto',
    ultimoMensaje: conversacion.mensaje || 'Sin mensajes',
    tiempo: formatearFechaRelativa(conversacion.fecha_envio),
    leido: conversacion.leido,
  };
};

export const formatearHistorial = (historial) => ({
  id: historial.id_historial_estudiante,
  titulo: historial.titulo_proyecto,
  tipo: historial.tipo,
  descripcion: historial.descripcion || '',
  tecnologias: (historial.tecnologias || '').split(',').map((t) => t.trim()).filter(Boolean),
  enlace: historial.enlace,
  rol: historial.rol_desempenado || '—',
  fechaInicio: historial.fecha_inicio ? new Date(historial.fecha_inicio).toLocaleDateString() : '—',
  fechaFin: historial.fecha_fin ? new Date(historial.fecha_fin).toLocaleDateString() : '—',
});
