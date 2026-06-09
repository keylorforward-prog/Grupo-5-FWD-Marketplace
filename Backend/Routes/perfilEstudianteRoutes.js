const express = require('express');
const router = express.Router();
const controller = require('../Controllers/perfilEstudianteController');

/**
 * @swagger
 * tags:
 *   name: PerfilEstudiante
 *   description: API para la gestión de PerfilEstudiante
 */

/**
 * @swagger
 * /api/perfiles-estudiante:
 *   get:
 *     summary: Obtener todos los registros de PerfilEstudiante
 *     tags: [PerfilEstudiante]
 *     responses:
 *       200:
 *         description: Lista de PerfilEstudiante
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/perfiles-estudiante/{id}:
 *   get:
 *     summary: Obtener un registro de PerfilEstudiante por ID
 *     tags: [PerfilEstudiante]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de PerfilEstudiante
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/perfiles-estudiante:
 *   post:
 *     summary: Crear un nuevo registro de PerfilEstudiante
 *     tags: [PerfilEstudiante]
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
 * /api/perfiles-estudiante/{id}:
 *   put:
 *     summary: Actualizar un registro de PerfilEstudiante por ID
 *     tags: [PerfilEstudiante]
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
 * /api/perfiles-estudiante/{id}:
 *   delete:
 *     summary: Eliminar un registro de PerfilEstudiante por ID
 *     tags: [PerfilEstudiante]
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
