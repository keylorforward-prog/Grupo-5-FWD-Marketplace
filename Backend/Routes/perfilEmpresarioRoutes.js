const express = require('express');
const router = express.Router();
const controller = require('../Controllers/perfilEmpresarioController');

/**
 * @swagger
 * tags:
 *   name: PerfilEmpresario
 *   description: API para la gestión de PerfilEmpresario
 */

/**
 * @swagger
 * /api/perfiles-empresario:
 *   get:
 *     summary: Obtener todos los registros de PerfilEmpresario
 *     tags: [PerfilEmpresario]
 *     responses:
 *       200:
 *         description: Lista de PerfilEmpresario
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/perfiles-empresario/{id}:
 *   get:
 *     summary: Obtener un registro de PerfilEmpresario por ID
 *     tags: [PerfilEmpresario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de PerfilEmpresario
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/perfiles-empresario:
 *   post:
 *     summary: Crear un nuevo registro de PerfilEmpresario
 *     tags: [PerfilEmpresario]
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
 * /api/perfiles-empresario/{id}:
 *   put:
 *     summary: Actualizar un registro de PerfilEmpresario por ID
 *     tags: [PerfilEmpresario]
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
 * /api/perfiles-empresario/{id}:
 *   delete:
 *     summary: Eliminar un registro de PerfilEmpresario por ID
 *     tags: [PerfilEmpresario]
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
