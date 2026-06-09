const express = require('express');
const router = express.Router();
const controller = require('../Controllers/historialProyectoEstudianteController');

/**
 * @swagger
 * tags:
 *   name: HistorialProyectoEstudiante
 *   description: API para la gestión de HistorialProyectoEstudiante
 */

/**
 * @swagger
 * /api/historial-proyectos-estudiante:
 *   get:
 *     summary: Obtener todos los registros de HistorialProyectoEstudiante
 *     tags: [HistorialProyectoEstudiante]
 *     responses:
 *       200:
 *         description: Lista de HistorialProyectoEstudiante
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/historial-proyectos-estudiante/{id}:
 *   get:
 *     summary: Obtener un registro de HistorialProyectoEstudiante por ID
 *     tags: [HistorialProyectoEstudiante]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de HistorialProyectoEstudiante
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/historial-proyectos-estudiante:
 *   post:
 *     summary: Crear un nuevo registro de HistorialProyectoEstudiante
 *     tags: [HistorialProyectoEstudiante]
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
 * /api/historial-proyectos-estudiante/{id}:
 *   put:
 *     summary: Actualizar un registro de HistorialProyectoEstudiante por ID
 *     tags: [HistorialProyectoEstudiante]
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
 * /api/historial-proyectos-estudiante/{id}:
 *   delete:
 *     summary: Eliminar un registro de HistorialProyectoEstudiante por ID
 *     tags: [HistorialProyectoEstudiante]
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
