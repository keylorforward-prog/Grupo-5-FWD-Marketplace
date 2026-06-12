import apiClient from './apiClient';

export const authService = {
  /**
   * Registrar un nuevo usuario
   */
  async register(payload) {

    const formData = new FormData();
    
    Object.keys(payload).forEach(key => {
      if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    });

    const { data } = await apiClient.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Iniciar sesión
   */
  async login({ email, password }) {
    const { data } = await apiClient.post('/auth/login', { email, password });
    return data;
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    const { data } = await apiClient.post('/auth/logout');
    return data;
  },

  /**
   * Obtener datos del usuario autenticado (valida el token)
   */
  async getMe(token) {
    const { data } = await apiClient.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
