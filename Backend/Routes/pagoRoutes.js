const express = require('express');
const router = express.Router();
const controller = require('../Controllers/pagoController');

/**
 * @swagger
 * tags:
 *   name: Pago
 *   description: API para la gestión de Pago
 */

/**
 * @swagger
 * /api/pagos:
 *   get:
 *     summary: Obtener todos los registros de Pago
 *     tags: [Pago]
 *     responses:
 *       200:
 *         description: Lista de Pago
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/pagos/{id}:
 *   get:
 *     summary: Obtener un registro de Pago por ID
 *     tags: [Pago]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de Pago
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/pagos:
 *   post:
 *     summary: Crear un nuevo registro de Pago
 *     tags: [Pago]
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
 * /api/pagos/{id}:
 *   put:
 *     summary: Actualizar un registro de Pago por ID
 *     tags: [Pago]
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
 * /api/pagos/{id}:
 *   delete:
 *     summary: Eliminar un registro de Pago por ID
 *     tags: [Pago]
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
