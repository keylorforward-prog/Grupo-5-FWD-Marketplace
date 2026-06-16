import axios from 'axios';

const API_URL = 'http://localhost:3000/api/admin';

// Configurar interceptor para enviar el token en todas las peticiones
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: { Authorization: `Bearer ${token}` }
  };
};

export const adminService = {
  getOverview: async () => {
    const response = await axios.get(`${API_URL}/overview`, getAuthHeaders());
    return response.data;
  },

  getUsuarios: async () => {
    const response = await axios.get(`${API_URL}/usuarios`, getAuthHeaders());
    return response.data;
  },

  suspendUsuario: async (id_usuario, accion, motivo) => {
    const response = await axios.post(`${API_URL}/usuarios/${id_usuario}/suspender`, { accion, motivo }, getAuthHeaders());
    return response.data;
  },

  getEgresadosPendientes: async () => {
    const response = await axios.get(`${API_URL}/egresados/pendientes`, getAuthHeaders());
    return response.data;
  },

  verifyEstudiante: async (id_usuario, accion, motivo_rechazo = null) => {
    const response = await axios.post(`${API_URL}/egresados/${id_usuario}/verificar`, { accion, motivo_rechazo }, getAuthHeaders());
    return response.data;
  }
};
