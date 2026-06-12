const express = require('express');
const router = express.Router();
const controller = require('../Controllers/conversacionIAController');

router.post('/', controller.create);
router.put('/:id', controller.update);
router.get('/empresario/:id', controller.getActiveByEmpresario);
router.get('/:id', controller.getById);

module.exports = router;
