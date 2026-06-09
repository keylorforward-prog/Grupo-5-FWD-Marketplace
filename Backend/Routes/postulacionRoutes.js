const express = require('express');
const router = express.Router();
const controller = require('../Controllers/postulacionController');

/**
 * @swagger
 * tags:
 *   name: Postulacion
 *   description: API para la gestión de Postulacion
 */

/**
 * @swagger
 * /api/postulaciones:
 *   get:
 *     summary: Obtener todos los registros de Postulacion
 *     tags: [Postulacion]
 *     responses:
 *       200:
 *         description: Lista de Postulacion
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/postulaciones/{id}:
 *   get:
 *     summary: Obtener un registro de Postulacion por ID
 *     tags: [Postulacion]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de Postulacion
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/postulaciones:
 *   post:
 *     summary: Crear un nuevo registro de Postulacion
 *     tags: [Postulacion]
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
 * /api/postulaciones/{id}:
 *   put:
 *     summary: Actualizar un registro de Postulacion por ID
 *     tags: [Postulacion]
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
 * /api/postulaciones/{id}:
 *   delete:
 *     summary: Eliminar un registro de Postulacion por ID
 *     tags: [Postulacion]
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
