const express = require('express');
const router = express.Router();
const controller = require('../Controllers/catalogoSectorController');

/**
 * @swagger
 * tags:
 *   name: CatalogoSector
 *   description: API para la gestión de CatalogoSector
 */

/**
 * @swagger
 * /api/catalogo-sectores:
 *   get:
 *     summary: Obtener todos los registros de CatalogoSector
 *     tags: [CatalogoSector]
 *     responses:
 *       200:
 *         description: Lista de CatalogoSector
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/catalogo-sectores/{id}:
 *   get:
 *     summary: Obtener un registro de CatalogoSector por ID
 *     tags: [CatalogoSector]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de CatalogoSector
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/catalogo-sectores:
 *   post:
 *     summary: Crear un nuevo registro de CatalogoSector
 *     tags: [CatalogoSector]
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
 * /api/catalogo-sectores/{id}:
 *   put:
 *     summary: Actualizar un registro de CatalogoSector por ID
 *     tags: [CatalogoSector]
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
 * /api/catalogo-sectores/{id}:
 *   delete:
 *     summary: Eliminar un registro de CatalogoSector por ID
 *     tags: [CatalogoSector]
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
