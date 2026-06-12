const express = require('express');
const router = express.Router();
const { verifyToken } = require('../Middleware/authMiddleware');
const dashboardEmpresarioController = require('../Controllers/dashboardEmpresarioController');

router.use(verifyToken);

router.get('/resumen', dashboardEmpresarioController.obtenerResumen);
router.get('/perfil', dashboardEmpresarioController.listarPerfil);
router.put('/perfil', dashboardEmpresarioController.actualizarPerfil);
router.get('/propuestas', dashboardEmpresarioController.listarPropuestas);
router.post('/propuestas', dashboardEmpresarioController.crearPropuesta);
router.put('/propuestas/:id', dashboardEmpresarioController.actualizarPropuesta);
router.delete('/propuestas/:id', dashboardEmpresarioController.eliminarPropuesta);
router.get('/ofertas', dashboardEmpresarioController.listarOfertas);
router.get('/postulaciones', dashboardEmpresarioController.listarPostulaciones);
router.get('/talento-recomendado', dashboardEmpresarioController.listarTalento);
router.get('/entregables', dashboardEmpresarioController.listarEntregables);
router.get('/mensajes-recientes', dashboardEmpresarioController.listarMensajesRecientes);
router.get('/notificaciones', dashboardEmpresarioController.listarNotificaciones);
router.get('/historial', dashboardEmpresarioController.listarHistorial);
router.get('/evaluaciones', dashboardEmpresarioController.listarEvaluaciones);
router.get('/pagos', dashboardEmpresarioController.listarPagos);

module.exports = router;
