const express = require('express');
const router = express.Router();
const controller = require('../Controllers/conversacionController');

/**
 * @swagger
 * tags:
 *   name: Conversacion
 *   description: API para la gestión de Conversacion
 */

/**
 * @swagger
 * /api/conversaciones:
 *   get:
 *     summary: Obtener todos los registros de Conversacion
 *     tags: [Conversacion]
 *     responses:
 *       200:
 *         description: Lista de Conversacion
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/conversaciones/{id}:
 *   get:
 *     summary: Obtener un registro de Conversacion por ID
 *     tags: [Conversacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de Conversacion
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/conversaciones:
 *   post:
 *     summary: Crear un nuevo registro de Conversacion
 *     tags: [Conversacion]
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
 * /api/conversaciones/{id}:
 *   put:
 *     summary: Actualizar un registro de Conversacion por ID
 *     tags: [Conversacion]
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
 * /api/conversaciones/{id}:
 *   delete:
 *     summary: Eliminar un registro de Conversacion por ID
 *     tags: [Conversacion]
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
