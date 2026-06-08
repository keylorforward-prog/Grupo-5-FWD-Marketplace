const express = require('express');
const router = express.Router();
const controller = require('../Controllers/curriculumController');

/**
 * @swagger
 * tags:
 *   name: Curriculum
 *   description: API para la gestión de Curriculum
 */

/**
 * @swagger
 * /api/curriculums:
 *   get:
 *     summary: Obtener todos los registros de Curriculum
 *     tags: [Curriculum]
 *     responses:
 *       200:
 *         description: Lista de Curriculum
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/curriculums/{id}:
 *   get:
 *     summary: Obtener un registro de Curriculum por ID
 *     tags: [Curriculum]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de Curriculum
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/curriculums:
 *   post:
 *     summary: Crear un nuevo registro de Curriculum
 *     tags: [Curriculum]
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
 * /api/curriculums/{id}:
 *   put:
 *     summary: Actualizar un registro de Curriculum por ID
 *     tags: [Curriculum]
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
 * /api/curriculums/{id}:
 *   delete:
 *     summary: Eliminar un registro de Curriculum por ID
 *     tags: [Curriculum]
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
