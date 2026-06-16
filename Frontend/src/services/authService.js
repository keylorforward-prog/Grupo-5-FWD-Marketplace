import axios from 'axios';
import apiClient from './apiClient';

export const api = axios.create({
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
   * Iniciar sesión como administrador
   */
  async adminLogin({ email, password }) {
    const { data } = await apiClient.post('/auth/admin-login', { email, password });
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
  async getMe() {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  /**
   * Callback de Google - retorna user y token después de autenticarse con Google
   */
  async handleGoogleCallback() {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },

  /**
   * Actualizar contraseña
   */
  async updatePassword({ currentPassword, newPassword }) {
    const { data } = await api.put('/auth/update-password', { currentPassword, newPassword });
    return data;
  },
};
