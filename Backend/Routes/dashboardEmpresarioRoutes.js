const express = require('express');
const router = express.Router();
const { verifyToken } = require('../Middleware/authMiddleware');
const dashboardEmpresarioController = require('../Controllers/dashboardEmpresarioController');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.use(verifyToken);

router.get('/resumen', dashboardEmpresarioController.obtenerResumen);
router.get('/perfil', dashboardEmpresarioController.listarPerfil);
router.put('/perfil', dashboardEmpresarioController.actualizarPerfil);
router.post('/perfil/foto', upload.single('foto_perfil'), dashboardEmpresarioController.subirFotoPerfil);
router.get('/propuestas', dashboardEmpresarioController.listarPropuestas);
router.post('/propuestas', dashboardEmpresarioController.crearPropuesta);
router.put('/propuestas/:id', dashboardEmpresarioController.actualizarPropuesta);
router.delete('/propuestas/:id', dashboardEmpresarioController.eliminarPropuesta);
router.get('/ofertas-empleo',  dashboardEmpresarioController.listarOfertasEmpleo);
router.post('/ofertas-empleo', dashboardEmpresarioController.crearOfertaEmpleo);
router.get('/ofertas', dashboardEmpresarioController.listarOfertas);
router.post('/ofertas/:id_oferta/aceptar', dashboardEmpresarioController.aceptarOferta);
router.post('/ofertas/:id_oferta/rechazar', dashboardEmpresarioController.rechazarOferta);
router.get('/postulaciones', dashboardEmpresarioController.listarPostulaciones);
router.get('/talento-recomendado', dashboardEmpresarioController.listarTalento);
router.get('/entregables', dashboardEmpresarioController.listarEntregables);
router.get('/mensajes-recientes', dashboardEmpresarioController.listarMensajesRecientes);
router.get('/notificaciones', dashboardEmpresarioController.listarNotificaciones);
router.get('/historial', dashboardEmpresarioController.listarHistorial);
router.get('/evaluaciones', dashboardEmpresarioController.listarEvaluaciones);
router.get('/pagos', dashboardEmpresarioController.listarPagos);

module.exports = router;
