import apiClient from './apiClient';
import { DATOS_FALLBACK } from './dashboardFallbackData';

const extraerData = (respuesta) => respuesta.data?.data ?? respuesta.data;

const esErrorDeRed = (error) =>
  !error.response && error.code === 'ERR_NETWORK';

const get = async (url, params) => {
  try {
    const respuesta = await apiClient.get(url, { params });
    return extraerData(respuesta);
  } catch (error) {
    if (esErrorDeRed(error)) {
      if (url.includes('/resumen')) return DATOS_FALLBACK.resumen;
      if (url.includes('/postulaciones')) return DATOS_FALLBACK.postulaciones;
      if (url.includes('/proyectos')) return DATOS_FALLBACK.proyectos;
      if (url.includes('/historial')) return DATOS_FALLBACK.historial;
      if (url.includes('/notificaciones')) return DATOS_FALLBACK.notificaciones;
      if (url.includes('/mensajes-recientes')) return DATOS_FALLBACK.mensajes;
      if (url.includes('/perfil')) return DATOS_FALLBACK.perfil;
    }
    throw error;
  }
};

export const egresadoDashboardService = {
  obtenerInicio() {
    return Promise.all([
      this.obtenerResumen(),
      this.obtenerPostulaciones({ limit: 5 }),
      this.obtenerProyectos({ limit: 3 }),
      this.obtenerNotificaciones({ limit: 4 }),
      this.obtenerMensajesRecientes({ limit: 3 }),
    ]).then(([resumen, postulaciones, proyectos, notificaciones, mensajes]) => ({
      resumen,
      postulaciones,
      proyectos,
      notificaciones,
      mensajes,
    }));
  },

  obtenerResumen() {
    return get('/dashboard-egresado/resumen');
  },

  obtenerPerfil() {
    return get('/dashboard-egresado/perfil');
  },

  async actualizarPerfil(payload) {
    try {
      const respuesta = await apiClient.put('/dashboard-egresado/perfil', payload);
      return extraerData(respuesta);
    } catch (error) {
      if (esErrorDeRed(error)) return DATOS_FALLBACK.perfil;
      throw error;
    }
  },

  obtenerPostulaciones(params) {
    return get('/dashboard-egresado/postulaciones', params);
  },

  obtenerPostulacionesEmpleo(params) {
    return get('/dashboard-egresado/postulaciones-empleo', params);
  },

  obtenerProyectos(params) {
    return get('/dashboard-egresado/proyectos', params);
  },

  obtenerHistorial(params) {
    return get('/dashboard-egresado/historial', params);
  },

  obtenerNotificaciones(params) {
    return get('/dashboard-egresado/notificaciones', params);
  },

  async marcarNotificacionLeida(id) {
    try {
      await apiClient.put(`/dashboard-egresado/notificaciones/${id}/leer`);
    } catch (error) {
      if (esErrorDeRed(error)) return;
      throw error;
    }
  },

  async marcarTodasNotificacionesLeidas() {
    try {
      await apiClient.put('/dashboard-egresado/notificaciones/leer-todas');
    } catch (error) {
      if (esErrorDeRed(error)) return;
      throw error;
    }
  },

  obtenerMensajesRecientes(params) {
    return get('/dashboard-egresado/mensajes-recientes', params);
  },

  obtenerOfertas(params) {
    return get('/dashboard-egresado/ofertas', params);
  },

  obtenerConversacion(idPostulacion) {
    return apiClient.get(`/dashboard-egresado/conversacion/${idPostulacion}`)
      .then((r) => r.data?.data ?? r.data);
  },

  enviarMensaje(idPostulacion, mensaje) {
    return apiClient.post('/dashboard-egresado/enviar-mensaje', { id_postulacion: idPostulacion, mensaje })
      .then((r) => r.data?.data ?? r.data);
  },

  marcarLeidos(idPostulacion) {
    return apiClient.put(`/dashboard-egresado/marcar-leido/${idPostulacion}`).then((r) => r.data);
  },

  obtenerHistorialProyectos() {
    return get('/dashboard-egresado/historial');
  },

  async crearHistorialProyecto(proyecto) {
    try {
      const respuesta = await apiClient.post('/dashboard-egresado/historial', proyecto);
      return extraerData(respuesta);
    } catch (error) {
      if (esErrorDeRed(error)) return proyecto;
      throw error;
    }
  },

  async actualizarHistorialProyecto(id, proyecto) {
    try {
      const respuesta = await apiClient.put(`/dashboard-egresado/historial/${id}`, proyecto);
      return extraerData(respuesta);
    } catch (error) {
      if (esErrorDeRed(error)) return proyecto;
      throw error;
    }
  },

  async eliminarHistorialProyecto(id) {
    try {
      await apiClient.delete(`/dashboard-egresado/historial/${id}`);
    } catch (error) {
      if (esErrorDeRed(error)) return;
      throw error;
    }
  },

  async subirDocumentoCv(file) {
    try {
      const formData = new FormData();
      formData.append('documento_cv', file);
      const respuesta = await apiClient.post('/dashboard-egresado/perfil/cv-documento', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return extraerData(respuesta);
    } catch (error) {
      throw error;
    }
  },

  async obtenerCatalogoTecnologias() {
    try {
      const respuesta = await apiClient.get('/catalogo-tecnologias');
      const data = extraerData(respuesta);
      return Array.isArray(data) ? data.map((t) => t.nombre) : [];
    } catch {
      return [];
    }
  },
};
