const express = require('express');
const router = express.Router();
const controller = require('../Controllers/mensajeController');

/**
 * @swagger
 * tags:
 *   name: Mensaje
 *   description: API para la gestión de Mensaje
 */

/**
 * @swagger
 * /api/mensajes:
 *   get:
 *     summary: Obtener todos los registros de Mensaje
 *     tags: [Mensaje]
 *     responses:
 *       200:
 *         description: Lista de Mensaje
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/mensajes/{id}:
 *   get:
 *     summary: Obtener un registro de Mensaje por ID
 *     tags: [Mensaje]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de Mensaje
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/mensajes:
 *   post:
 *     summary: Crear un nuevo registro de Mensaje
 *     tags: [Mensaje]
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
 * /api/mensajes/{id}:
 *   put:
 *     summary: Actualizar un registro de Mensaje por ID
 *     tags: [Mensaje]
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
 * /api/mensajes/{id}:
 *   delete:
 *     summary: Eliminar un registro de Mensaje por ID
 *     tags: [Mensaje]
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
