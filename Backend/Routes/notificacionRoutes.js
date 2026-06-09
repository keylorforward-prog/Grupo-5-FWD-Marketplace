const express = require('express');
const router = express.Router();
const controller = require('../Controllers/notificacionController');

/**
 * @swagger
 * tags:
 *   name: Notificacion
 *   description: API para la gestión de Notificacion
 */

/**
 * @swagger
 * /api/notificaciones:
 *   get:
 *     summary: Obtener todos los registros de Notificacion
 *     tags: [Notificacion]
 *     responses:
 *       200:
 *         description: Lista de Notificacion
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/notificaciones/{id}:
 *   get:
 *     summary: Obtener un registro de Notificacion por ID
 *     tags: [Notificacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de Notificacion
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/notificaciones:
 *   post:
 *     summary: Crear un nuevo registro de Notificacion
 *     tags: [Notificacion]
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
 * /api/notificaciones/{id}:
 *   put:
 *     summary: Actualizar un registro de Notificacion por ID
 *     tags: [Notificacion]
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
 * /api/notificaciones/{id}:
 *   delete:
 *     summary: Eliminar un registro de Notificacion por ID
 *     tags: [Notificacion]
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
