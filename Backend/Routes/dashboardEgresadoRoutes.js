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
router.get('/ofertas', controller.listarOfertas);
router.get('/notificaciones', controller.listarNotificaciones);
router.put('/notificaciones/:id/leer', controller.marcarNotificacionLeida);
router.put('/notificaciones/leer-todas', controller.marcarTodasNotificacionesLeidas);
router.get('/mensajes-recientes', controller.listarMensajesRecientes);
router.get('/conversacion/:idPostulacion', controller.obtenerConversacion);
router.post('/enviar-mensaje', controller.enviarMensaje);
router.put('/marcar-leido/:idPostulacion', controller.marcarLeidos);

module.exports = router;
