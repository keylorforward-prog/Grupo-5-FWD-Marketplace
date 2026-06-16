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

    // CORRECCIÓN: Uso de 'api' en lugar de 'apiClient'
    const { data } = await api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Iniciar sesión
   */
  async login({ email, password }) {
    // CORRECCIÓN: Uso de 'api'
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    // CORRECCIÓN: Uso de 'api'
    const { data } = await api.post('/auth/logout');
    return data;
  },

  /**
   * Obtener datos del usuario autenticado (valida el token)
   */
  async getMe() {
    // CORRECCIÓN: Uso de 'api'
    const { data } = await api.get('/auth/me');
    return data;
  },

  /**
   * Callback de Google - retorna user y token después de autenticarse con Google
   */
  async handleGoogleCallback() {
    // CORRECCIÓN: Uso de 'api'
    const { data } = await api.get('/auth/me');
    return data;
  },

  /**
   * Actualizar contraseña
   */
  async updatePassword({ currentPassword, newPassword }) {
    const { data } = await apiClient.put('/auth/update-password', { currentPassword, newPassword });
    return data;
  },
};

// Export api as apiClient to avoid breaking other imports that relied on 'api' from authService temporarily
export const api = apiClient;
