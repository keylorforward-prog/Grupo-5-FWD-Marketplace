const express = require('express');
const router = express.Router();
const controller = require('../Controllers/evaluacionController');

/**
 * @swagger
 * tags:
 *   name: Evaluacion
 *   description: API para la gestión de Evaluacion
 */

/**
 * @swagger
 * /api/evaluaciones:
 *   get:
 *     summary: Obtener todos los registros de Evaluacion
 *     tags: [Evaluacion]
 *     responses:
 *       200:
 *         description: Lista de Evaluacion
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/evaluaciones/{id}:
 *   get:
 *     summary: Obtener un registro de Evaluacion por ID
 *     tags: [Evaluacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de Evaluacion
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/evaluaciones:
 *   post:
 *     summary: Crear un nuevo registro de Evaluacion
 *     tags: [Evaluacion]
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
 * /api/evaluaciones/{id}:
 *   put:
 *     summary: Actualizar un registro de Evaluacion por ID
 *     tags: [Evaluacion]
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
 * /api/evaluaciones/{id}:
 *   delete:
 *     summary: Eliminar un registro de Evaluacion por ID
 *     tags: [Evaluacion]
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
