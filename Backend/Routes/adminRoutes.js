const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const { verifyToken } = require('../Middleware/authMiddleware');

// Middleware manual para verificar si el rol es ADMIN
const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'ADMIN') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Acceso denegado: solo administradores' });
};

// Aplicar middleware de autenticación y rol a todas las rutas
router.use(verifyToken, isAdmin);

// Endpoints
router.get('/overview', adminController.getOverview);
router.get('/verificacion/metricas', adminController.getMetricasVerificacion);
router.get('/actividad/stream', adminController.streamActividad);
router.get('/busqueda', adminController.busquedaGlobal);
router.get('/notificaciones', adminController.getAdminNotificaciones);
router.get('/auditoria', adminController.getAuditoria);
router.get('/reportes', adminController.getReportesAdmin);
router.post('/reportes/:id_reporte/resolver', adminController.resolverReporte);
router.post('/acciones-masivas', adminController.accionesMasivas);
router.get('/export/:tipo.csv', adminController.exportCsv);
router.get('/system/health', adminController.healthSistema);
router.get('/configuracion', adminController.getConfiguracion);
router.put('/configuracion', adminController.updateConfiguracion);
router.get('/usuarios', adminController.getUsuarios);
router.get('/usuarios/:id_usuario/detalle', adminController.getUsuarioDetalle);
router.put('/usuarios/:id_usuario', adminController.updateUsuario);
router.post('/usuarios/:id_usuario/suspender', adminController.suspendUsuario);

router.get('/empresas', adminController.getEmpresas);
router.post('/empresas/:id_usuario/estado', adminController.updateEstadoEmpresa);

router.get('/proyectos', adminController.getProyectos);

router.get('/egresados/pendientes', adminController.getEgresadosPendientes);
router.post('/egresados/:id_usuario/verificar', adminController.verifyEstudiante);

// Rutas para supervisión de proyectos
router.get('/proyectos', adminController.getProyectos);
router.get('/proyectos/:id/detalle', adminController.getProyectoDetalle);
router.put('/proyectos/:id/estado', adminController.updateEstadoProyecto);

module.exports = router;
