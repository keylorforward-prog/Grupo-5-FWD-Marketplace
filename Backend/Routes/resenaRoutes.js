const express = require('express');
const router = express.Router();
const { verifyToken } = require('../Middleware/authMiddleware');
const resenaController = require('../Controllers/resenaController');

router.use(verifyToken);

router.post('/', resenaController.crearResena);
router.get('/perfil/:id_perfil/:rol', resenaController.listarResenasVisibles);
router.get('/propia/:id_proyecto/:rol', resenaController.obtenerResenaPropia);

module.exports = router;
