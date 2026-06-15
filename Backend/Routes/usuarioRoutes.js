const express = require('express');
const router = express.Router();
const controller = require('../Controllers/usuarioController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   name: Usuario
 *   description: API para la gestión de Usuario
 */

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los registros de Usuario
 *     tags: [Usuario]
 *     responses:
 *       200:
 *         description: Lista de Usuario
 */
router.get('/', controller.getAll);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un registro de Usuario por ID
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle de Usuario
 */
router.get('/:id', controller.getById);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo registro de Usuario
 *     tags: [Usuario]
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
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar un registro de Usuario por ID
 *     tags: [Usuario]
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
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un registro de Usuario por ID
 *     tags: [Usuario]
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

/**
 * @swagger
 * /api/usuarios/{id}/foto-perfil:
 *   put:
 *     summary: Actualizar la foto de perfil de un Usuario
 *     tags: [Usuario]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto actualizada
 */
router.put('/:id/foto-perfil', upload.single('foto'), controller.uploadFotoPerfil);

module.exports = router;
