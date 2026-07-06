import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Envía/recibe cookies httpOnly
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: agrega el token JWT en cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

    const { data } = await api.post('/auth/register', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Iniciar sesión
   */
  async login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  /**
   * Iniciar sesión como administrador
   */
  async adminLogin({ email, password }) {
    const { data } = await api.post('/auth/admin-login', { email, password });
    return data;
  },

  /**
   * Cerrar sesión
   */
  async logout() {
    const { data } = await api.post('/auth/logout');
    return data;
  },

  /**
   * Obtener datos del usuario autenticado (valida el token)
   */
  async getMe() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  /**
   * Callback de Google - retorna user y token después de autenticarse con Google
   */
  async handleGoogleCallback() {
    const { data } = await api.get('/auth/me');
    return data;
  },

  /**
   * Completar perfil para usuarios de Google OAuth
   */
  async completarPerfil(payload) {
    const formData = new FormData();

    Object.keys(payload).forEach(key => {
      if (payload[key] !== null && payload[key] !== undefined) {
        formData.append(key, payload[key]);
      }
    });

    const { data } = await api.put('/auth/completar-perfil', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },

  /**
   * Actualizar contraseña
   */
  async updatePassword({ currentPassword, newPassword }) {
    const { data } = await api.put('/auth/update-password', { currentPassword, newPassword });
    return data;
  },
  /**
 * Solicitar código de recuperación
 */
  async forgotPassword(email) {
    const { data } = await api.post('/auth/forgot-password', {
      email,
    });

    return data;
  },

  /**
   * Verificar código de recuperación
   */
  async verifyRecoveryCode({ email, code }) {
    const { data } = await api.post('/auth/verify-recovery-code', {
      email,
      code,
    });

    return data;
  },

  /**
   * Restablecer contraseña
   */
  async resetPassword({ email, code, newPassword }) {
    const { data } = await api.post('/auth/reset-password', {
      email,
      code,
      newPassword,
    });

    return data;
  },


};


