const express = require('express');
const router = express.Router();
const controller = require('../Controllers/ofertaController');

/**
 * @swagger
 * tags:
 *   name: Oferta
 *   description: API para la gestión de Oferta
 */

/**
 * @swagger
 * /api/ofertas:
 *   get:
 *     summary: Obtener todos los registros de Oferta
 *     tags: [Oferta]
 *     responses:
 *       200:
 *         description: Lista de Oferta
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/ofertas/{id}:
 *   get:
 *     summary: Obtener un registro de Oferta por ID
 *     tags: [Oferta]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de Oferta
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/ofertas:
 *   post:
 *     summary: Crear un nuevo registro de Oferta
 *     tags: [Oferta]
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
 * /api/ofertas/{id}:
 *   put:
 *     summary: Actualizar un registro de Oferta por ID
 *     tags: [Oferta]
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
 * /api/ofertas/{id}:
 *   delete:
 *     summary: Eliminar un registro de Oferta por ID
 *     tags: [Oferta]
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
