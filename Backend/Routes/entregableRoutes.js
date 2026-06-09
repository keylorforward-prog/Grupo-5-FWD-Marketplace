const express = require('express');
const router = express.Router();
const controller = require('../Controllers/entregableController');

/**
 * @swagger
 * tags:
 *   name: Entregable
 *   description: API para la gestión de Entregable
 */

/**
 * @swagger
 * /api/entregables:
 *   get:
 *     summary: Obtener todos los registros de Entregable
 *     tags: [Entregable]
 *     responses:
 *       200:
 *         description: Lista de Entregable
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/entregables/{id}:
 *   get:
 *     summary: Obtener un registro de Entregable por ID
 *     tags: [Entregable]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de Entregable
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/entregables:
 *   post:
 *     summary: Crear un nuevo registro de Entregable
 *     tags: [Entregable]
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
 * /api/entregables/{id}:
 *   put:
 *     summary: Actualizar un registro de Entregable por ID
 *     tags: [Entregable]
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
 * /api/entregables/{id}:
 *   delete:
 *     summary: Eliminar un registro de Entregable por ID
 *     tags: [Entregable]
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
