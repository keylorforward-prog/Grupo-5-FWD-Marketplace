const express = require('express');
const router = express.Router();
const controller = require('../Controllers/propuestaController');

/**
 * @swagger
 * tags:
 *   name: Propuesta
 *   description: API para la gestión de Propuesta
 */

/**
 * @swagger
 * /api/propuestas:
 *   get:
 *     summary: Obtener todos los registros de Propuesta
 *     tags: [Propuesta]
 *     responses:
 *       200:
 *         description: Lista de Propuesta
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/propuestas/{id}:
 *   get:
 *     summary: Obtener un registro de Propuesta por ID
 *     tags: [Propuesta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de Propuesta
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/propuestas:
 *   post:
 *     summary: Crear un nuevo registro de Propuesta
 *     tags: [Propuesta]
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
 * /api/propuestas/{id}:
 *   put:
 *     summary: Actualizar un registro de Propuesta por ID
 *     tags: [Propuesta]
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
 * /api/propuestas/{id}:
 *   delete:
 *     summary: Eliminar un registro de Propuesta por ID
 *     tags: [Propuesta]
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
