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

  obtenerOfertas(params) {
    return get('/dashboard-empresario/ofertas', params);
  },

  obtenerPostulaciones(params) {
    return get('/dashboard-empresario/postulaciones', params);
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

  obtenerHistorial(params) {
    return get('/dashboard-empresario/historial', params);
  },

  obtenerEvaluaciones(params) {
    return get('/dashboard-empresario/evaluaciones', params);
  },

  obtenerPagos(params) {
    return get('/dashboard-empresario/pagos', params);
  },
};
