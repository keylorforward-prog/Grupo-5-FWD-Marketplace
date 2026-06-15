const express = require('express');
const router = express.Router();
const { register, login, logout, me, updatePassword } = require('../Controllers/authController');
const { verifyToken } = require('../Middleware/authMiddleware');
const multer = require('multer');

// Usamos memory storage para tener el archivo en buffer y mandarlo a S3
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación y gestión de sesión de usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *               - cedula
 *               - rol
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@ejemplo.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: mi_contraseña123
 *               cedula:
 *                 type: string
 *                 example: 1-2345-6789
 *               rol:
 *                 type: string
 *                 enum: [ADMIN, ESTUDIANTE, EMPRESARIO]
 *                 example: ESTUDIANTE
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *       400:
 *         description: Datos incompletos o inválidos
 *       409:
 *         description: El email ya está en uso
 *       500:
 *         description: Error del servidor
 */
router.post('/register', upload.fields([
  { name: 'titulo_fwd_file', maxCount: 1 },
  { name: 'cedula_juridica_file', maxCount: 1 }
]), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@ejemplo.com
 *               password:
 *                 type: string
 *                 example: mi_contraseña123
 *     responses:
 *       200:
 *         description: Login exitoso — devuelve token JWT
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error del servidor
 */
router.post('/login', login);

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 */
router.post('/logout', logout);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener datos del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario autenticado
 *       401:
 *         description: Token inválido o expirado
 */
router.get('/me', verifyToken, me);

/**
 * @swagger
 * /api/auth/update-password:
 *   put:
 *     summary: Actualizar la contraseña del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *       400:
 *         description: Datos incompletos
 *       401:
 *         description: Contraseña actual incorrecta
 */
router.put('/update-password', verifyToken, updatePassword);

module.exports = router;
