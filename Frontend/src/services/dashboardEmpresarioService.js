import apiClient from './apiClient';

const extraerData = (respuesta) => respuesta.data?.data ?? respuesta.data;

const get = async (url, params) => {
  const respuesta = await apiClient.get(url, { params });
  return extraerData(respuesta);
};

export const dashboardEmpresarioService = {
  obtenerInicio() {
    return Promise.all([
      this.obtenerResumen(),
      this.obtenerPropuestas({ limit: 3 }),
      this.obtenerTalentoRecomendado({ limit: 2 }),
      this.obtenerOfertas({ estado: 'pendientes', limit: 3 }),
      this.obtenerEntregables({ estado: 'ENVIADO', limit: 3 }),
      this.obtenerMensajesRecientes({ limit: 3 }),
      this.obtenerNotificaciones({ limit: 4 }),
    ]).then(([resumen, propuestas, talento, ofertas, entregables, mensajes, notificaciones]) => ({
      resumen,
      propuestas,
      talento,
      ofertas,
      entregables,
      mensajes,
      notificaciones,
    }));
  },

  obtenerResumen() {
    return get('/dashboard-empresario/resumen');
  },

  obtenerPerfil() {
    return get('/dashboard-empresario/perfil');
  },

  actualizarPerfil(payload) {
    return apiClient.put('/dashboard-empresario/perfil', payload).then(extraerData);
  },

  subirFotoPerfil(file) {
    const formData = new FormData();
    formData.append('foto_perfil', file);
    return apiClient.post('/dashboard-empresario/perfil/foto', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(extraerData);
  },

  obtenerPropuestas(params) {
    return get('/dashboard-empresario/propuestas', params);
  },

  crearPropuesta(payload) {
    return apiClient.post('/dashboard-empresario/propuestas', payload).then(extraerData);
  },

  actualizarPropuesta(id, payload) {
    return apiClient.put(`/dashboard-empresario/propuestas/${id}`, payload).then(extraerData);
  },

  eliminarPropuesta(id) {
    return apiClient.delete(`/dashboard-empresario/propuestas/${id}`).then(extraerData);
  },

  obtenerOfertasEmpleo(params) {
    return get('/dashboard-empresario/ofertas-empleo', params);
  },

  crearOfertaEmpleo(payload) {
    return apiClient.post('/dashboard-empresario/ofertas-empleo', payload).then(extraerData);
  },

  obtenerOfertas(params) {
    return get('/dashboard-empresario/ofertas', params);
  },

  aceptarOferta(idOferta) {
    return apiClient.post(`/dashboard-empresario/ofertas/${idOferta}/aceptar`).then(extraerData);
  },

  rechazarOferta(idOferta) {
    return apiClient.post(`/dashboard-empresario/ofertas/${idOferta}/rechazar`).then(extraerData);
  },

  obtenerPostulaciones(params) {
    return get('/dashboard-empresario/postulaciones', params);
  },

  obtenerPostulacionesEmpleo(params) {
    return get('/dashboard-empresario/postulaciones-empleo', params);
  },

  actualizarEstadoPostulacion(id, estado, mensaje = '') {
    return apiClient.put(`/dashboard-empresario/postulaciones/${id}/estado`, { estado, mensaje }).then(extraerData);
  },

  actualizarEstadoPostulacionEmpleo(id, estado, mensaje = '') {
    return apiClient.put(`/dashboard-empresario/postulaciones-empleo/${id}/estado`, { estado, mensaje }).then(extraerData);
  },

  obtenerTalentoRecomendado(params) {
    return get('/dashboard-empresario/talento-recomendado', params);
  },

  obtenerEntregables(params) {
    return get('/dashboard-empresario/entregables', params);
  },

  obtenerMensajesRecientes(params) {
    return get('/dashboard-empresario/mensajes-recientes', params);
  },

  obtenerNotificaciones(params) {
    return get('/dashboard-empresario/notificaciones', params);
  },

  obtenerConversacion(idPostulacion) {
    return apiClient.get(`/dashboard-empresario/conversacion/${idPostulacion}`)
      .then((r) => r.data?.data ?? r.data);
  },

  enviarMensaje(idPostulacion, mensaje) {
    return apiClient.post('/dashboard-empresario/enviar-mensaje', { id_postulacion: idPostulacion, mensaje })
      .then((r) => r.data?.data ?? r.data);
  },

  marcarLeidos(idPostulacion) {
    return apiClient.put(`/dashboard-empresario/marcar-leido/${idPostulacion}`).then((r) => r.data);
  },

  obtenerHistorial(params) {
    return get('/dashboard-empresario/historial', params);
  },

  async crearHistorial(payload) {
    const respuesta = await apiClient.post('/dashboard-empresario/historial', payload);
    return extraerData(respuesta);
  },

  async actualizarHistorial(id, payload) {
    const respuesta = await apiClient.put(`/dashboard-empresario/historial/${id}`, payload);
    return extraerData(respuesta);
  },

  async eliminarHistorial(id) {
    await apiClient.delete(`/dashboard-empresario/historial/${id}`);
  },

  obtenerEvaluaciones(params) {
    return get('/dashboard-empresario/evaluaciones', params);
  },

  obtenerPagos(params) {
    return get('/dashboard-empresario/pagos', params);
  },
};
