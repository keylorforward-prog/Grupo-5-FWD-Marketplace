import apiClient from './apiClient';

export const notificacionService = {
  async obtenerMias(limit = 10) {
    const { data } = await apiClient.get('/notificaciones/mis-notificaciones', {
      params: { limit },
    });
    return data;
  },

  async marcarMiasComoLeidas() {
    const { data } = await apiClient.put('/notificaciones/mis-notificaciones/leidas');
    return data;
  },
};
