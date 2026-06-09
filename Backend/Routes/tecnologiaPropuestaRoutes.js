const express = require('express');
const router = express.Router();
const controller = require('../Controllers/tecnologiaPropuestaController');

/**
 * @swagger
 * tags:
 *   name: TecnologiaPropuesta
 *   description: API para la gestión de TecnologiaPropuesta
 */

/**
 * @swagger
 * /api/tecnologias-propuesta:
 *   get:
 *     summary: Obtener todos los registros de TecnologiaPropuesta
 *     tags: [TecnologiaPropuesta]
 *     responses:
 *       200:
 *         description: Lista de TecnologiaPropuesta
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/tecnologias-propuesta/{id}:
 *   get:
 *     summary: Obtener un registro de TecnologiaPropuesta por ID
 *     tags: [TecnologiaPropuesta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de TecnologiaPropuesta
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/tecnologias-propuesta:
 *   post:
 *     summary: Crear un nuevo registro de TecnologiaPropuesta
 *     tags: [TecnologiaPropuesta]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Registro creado
 */
router.post('/', controller.create);

/**
 * @swagger
 * /api/tecnologias-propuesta/{id}:
 *   put:
 *     summary: Actualizar un registro de TecnologiaPropuesta por ID
 *     tags: [TecnologiaPropuesta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Registro actualizado
 */
router.put('/:id', controller.update);

/**
 * @swagger
 * /api/tecnologias-propuesta/{id}:
 *   delete:
 *     summary: Eliminar un registro de TecnologiaPropuesta por ID
 *     tags: [TecnologiaPropuesta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Registro eliminado
 */
router.delete('/:id', controller.delete);

module.exports = router;
