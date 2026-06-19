const express = require('express');
const router = express.Router();
const multer = require('multer');
const { verifyToken } = require('../Middleware/authMiddleware');
const controller = require('../Controllers/dashboardEgresadoController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.use(verifyToken);

router.get('/perfil', controller.listarPerfil);
router.put('/perfil', controller.actualizarPerfil);
router.post('/perfil/cv-documento', upload.single('documento_cv'), controller.subirDocumentoCv);
router.get('/resumen', controller.obtenerResumen);
router.get('/postulaciones', controller.listarPostulaciones);
router.get('/proyectos', controller.listarProyectos);
router.get('/historial', controller.listarHistorial);
router.post('/historial', controller.crearHistorial);
router.put('/historial/:id', controller.actualizarHistorial);
router.delete('/historial/:id', controller.eliminarHistorial);
router.get('/ofertas', controller.listarOfertas);
router.get('/ofertas-empleo',            controller.listarOfertasEmpleo);
router.post('/ofertas-empleo/postular', controller.postularOfertaEmpleo);
router.get('/notificaciones', controller.listarNotificaciones);
router.put('/notificaciones/:id/leer', controller.marcarNotificacionLeida);
router.put('/notificaciones/leer-todas', controller.marcarTodasNotificacionesLeidas);
router.get('/mensajes-recientes', controller.listarMensajesRecientes);
router.get('/conversacion/:idPostulacion', controller.obtenerConversacion);
router.post('/enviar-mensaje', controller.enviarMensaje);
router.put('/marcar-leido/:idPostulacion', controller.marcarLeidos);

module.exports = router;
