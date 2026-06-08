const express = require('express');
const router = express.Router();
const controller = require('../Controllers/proyectoPlataformaController');

/**
 * @swagger
 * tags:
 *   name: ProyectoPlataforma
 *   description: API para la gestión de ProyectoPlataforma
 */

/**
 * @swagger
 * /api/proyectos-plataforma:
 *   get:
 *     summary: Obtener todos los registros de ProyectoPlataforma
 *     tags: [ProyectoPlataforma]
 *     responses:
 *       200:
 *         description: Lista de ProyectoPlataforma
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/proyectos-plataforma/{id}:
 *   get:
 *     summary: Obtener un registro de ProyectoPlataforma por ID
 *     tags: [ProyectoPlataforma]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de ProyectoPlataforma
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/proyectos-plataforma:
 *   post:
 *     summary: Crear un nuevo registro de ProyectoPlataforma
 *     tags: [ProyectoPlataforma]
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
 * /api/proyectos-plataforma/{id}:
 *   put:
 *     summary: Actualizar un registro de ProyectoPlataforma por ID
 *     tags: [ProyectoPlataforma]
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
 * /api/proyectos-plataforma/{id}:
 *   delete:
 *     summary: Eliminar un registro de ProyectoPlataforma por ID
 *     tags: [ProyectoPlataforma]
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
