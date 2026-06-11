import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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
   * Cerrar sesión
   */
  async logout() {
    const { data } = await api.post('/auth/logout');
    return data;
  },

  /**
   * Obtener datos del usuario autenticado (valida el token)
   */
  async getMe(token) {
    const { data } = await api.get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  },
};
