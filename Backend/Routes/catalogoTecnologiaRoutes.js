const express = require('express');
const router = express.Router();
const controller = require('../Controllers/catalogoTecnologiaController');

/**
 * @swagger
 * tags:
 *   name: CatalogoTecnologia
 *   description: API para la gestión de CatalogoTecnologia
 */

/**
 * @swagger
 * /api/catalogo-tecnologias:
 *   get:
 *     summary: Obtener todos los registros de CatalogoTecnologia
 *     tags: [CatalogoTecnologia]
 *     responses:
 *       200:
 *         description: Lista de CatalogoTecnologia
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/catalogo-tecnologias/{id}:
 *   get:
 *     summary: Obtener un registro de CatalogoTecnologia por ID
 *     tags: [CatalogoTecnologia]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de CatalogoTecnologia
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/catalogo-tecnologias:
 *   post:
 *     summary: Crear un nuevo registro de CatalogoTecnologia
 *     tags: [CatalogoTecnologia]
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
 * /api/catalogo-tecnologias/{id}:
 *   put:
 *     summary: Actualizar un registro de CatalogoTecnologia por ID
 *     tags: [CatalogoTecnologia]
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
 * /api/catalogo-tecnologias/{id}:
 *   delete:
 *     summary: Eliminar un registro de CatalogoTecnologia por ID
 *     tags: [CatalogoTecnologia]
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
