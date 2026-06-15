const express = require('express');
const router = express.Router();
const { verifyToken } = require('../Middleware/authMiddleware');
const controller = require('../Controllers/dashboardEgresadoController');

router.use(verifyToken);

router.get('/perfil', controller.listarPerfil);
router.put('/perfil', controller.actualizarPerfil);
router.get('/resumen', controller.obtenerResumen);
router.get('/postulaciones', controller.listarPostulaciones);
router.get('/proyectos', controller.listarProyectos);
router.get('/historial', controller.listarHistorial);
router.get('/notificaciones', controller.listarNotificaciones);
router.get('/mensajes-recientes', controller.listarMensajesRecientes);

module.exports = router;
