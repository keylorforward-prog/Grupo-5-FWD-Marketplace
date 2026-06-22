import apiClient from './apiClient';

export const adminService = {
  getOverview: async () => {
    const response = await apiClient.get('/admin/overview');
    return response.data;
  },

  getMetricasVerificacion: async () => {
    const response = await apiClient.get('/admin/verificacion/metricas');
    return response.data;
  },

  buscarGlobal: async (q) => {
    const response = await apiClient.get('/admin/busqueda', { params: { q } });
    return response.data;
  },

  getAdminNotificaciones: async () => {
    const response = await apiClient.get('/admin/notificaciones');
    return response.data;
  },

  getAuditoria: async (params = {}) => {
    const response = await apiClient.get('/admin/auditoria', { params });
    return response.data;
  },

  getReportes: async (params = {}) => {
    const response = await apiClient.get('/admin/reportes', { params });
    return response.data;
  },

  resolverReporte: async (id_reporte, payload) => {
    const response = await apiClient.post(`/admin/reportes/${id_reporte}/resolver`, payload);
    return response.data;
  },

  accionesMasivas: async (payload) => {
    const response = await apiClient.post('/admin/acciones-masivas', payload);
    return response.data;
  },

  getHealthSistema: async () => {
    const response = await apiClient.get('/admin/system/health');
    return response.data;
  },

  exportCsv: async (tipo) => {
    const response = await apiClient.get(`/admin/export/${tipo}.csv`, { responseType: 'blob' });
    return response.data;
  },

  getConfiguracion: async () => {
    const response = await apiClient.get('/admin/configuracion');
    return response.data;
  },

  updateConfiguracion: async (configuracion) => {
    const response = await apiClient.put('/admin/configuracion', { configuracion });
    return response.data;
  },

  getUsuarios: async (params = {}) => {
    const response = await apiClient.get('/admin/usuarios', { params });
    return response.data;
  },

  getUsuarioDetalle: async (id_usuario) => {
    const response = await apiClient.get(`/admin/usuarios/${id_usuario}/detalle`);
    return response.data;
  },

  updateUsuario: async (id_usuario, payload) => {
    const response = await apiClient.put(`/admin/usuarios/${id_usuario}`, payload);
    return response.data;
  },

  getEmpresas: async (params = {}) => {
    const response = await apiClient.get('/admin/empresas', { params });
    return response.data;
  },

  updateEstadoEmpresa: async (id_usuario, accion, motivo = null) => {
    const response = await apiClient.post(`/admin/empresas/${id_usuario}/estado`, { accion, motivo });
    return response.data;
  },

  suspendUsuario: async (id_usuario, accion, motivo) => {
    const response = await apiClient.post(`/admin/usuarios/${id_usuario}/suspender`, { accion, motivo });
    return response.data;
  },

  getEgresadosPendientes: async (params = {}) => {
    const response = await apiClient.get('/admin/egresados/pendientes', { params });
    return response.data;
  },

  verifyEstudiante: async (id_usuario, accion, motivo_rechazo = null) => {
    const response = await apiClient.post(`/admin/egresados/${id_usuario}/verificar`, { accion, motivo_rechazo });
    return response.data;
  },

  getProyectos: async (params = {}) => {
    const response = await apiClient.get('/admin/proyectos', { params });
    return response.data;
  },

  getProyectoDetalle: async (id_proyecto) => {
    const response = await apiClient.get(`/admin/proyectos/${id_proyecto}/detalle`);
    return response.data;
  },

  updateProyectoEstado: async (id_proyecto, estado, nota = '') => {
    const response = await apiClient.put(`/admin/proyectos/${id_proyecto}/estado`, { estado, nota });
    return response.data;
  }
};
