const express = require('express');
const router = express.Router();
const controller = require('../Controllers/reporteController');

/**
 * @swagger
 * tags:
 *   name: Reporte
 *   description: API para la gestión de Reporte
 */

/**
 * @swagger
 * /api/reportes:
 *   get:
 *     summary: Obtener todos los registros de Reporte
 *     tags: [Reporte]
 *     responses:
 *       200:
 *         description: Lista de Reporte
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/reportes/{id}:
 *   get:
 *     summary: Obtener un registro de Reporte por ID
 *     tags: [Reporte]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de Reporte
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/reportes:
 *   post:
 *     summary: Crear un nuevo registro de Reporte
 *     tags: [Reporte]
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
 * /api/reportes/{id}:
 *   put:
 *     summary: Actualizar un registro de Reporte por ID
 *     tags: [Reporte]
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
 * /api/reportes/{id}:
 *   delete:
 *     summary: Eliminar un registro de Reporte por ID
 *     tags: [Reporte]
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
