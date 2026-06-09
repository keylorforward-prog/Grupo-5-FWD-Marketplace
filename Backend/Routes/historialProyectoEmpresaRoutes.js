const express = require('express');
const router = express.Router();
const controller = require('../Controllers/historialProyectoEmpresaController');

/**
 * @swagger
 * tags:
 *   name: HistorialProyectoEmpresa
 *   description: API para la gestión de HistorialProyectoEmpresa
 */

/**
 * @swagger
 * /api/historial-proyectos-empresa:
 *   get:
 *     summary: Obtener todos los registros de HistorialProyectoEmpresa
 *     tags: [HistorialProyectoEmpresa]
 *     responses:
 *       200:
 *         description: Lista de HistorialProyectoEmpresa
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/historial-proyectos-empresa/{id}:
 *   get:
 *     summary: Obtener un registro de HistorialProyectoEmpresa por ID
 *     tags: [HistorialProyectoEmpresa]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de HistorialProyectoEmpresa
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/historial-proyectos-empresa:
 *   post:
 *     summary: Crear un nuevo registro de HistorialProyectoEmpresa
 *     tags: [HistorialProyectoEmpresa]
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
 * /api/historial-proyectos-empresa/{id}:
 *   put:
 *     summary: Actualizar un registro de HistorialProyectoEmpresa por ID
 *     tags: [HistorialProyectoEmpresa]
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
 * /api/historial-proyectos-empresa/{id}:
 *   delete:
 *     summary: Eliminar un registro de HistorialProyectoEmpresa por ID
 *     tags: [HistorialProyectoEmpresa]
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
