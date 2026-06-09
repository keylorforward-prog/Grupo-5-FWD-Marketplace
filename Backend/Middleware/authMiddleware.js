const jwt = require('jsonwebtoken');
const config = require('../Config/config');
const { Usuario } = require('../Models');

/**
 * Middleware que verifica el token JWT.
 * Busca el token en:
 *   1. Header Authorization: Bearer <token>
 *   2. Cookie: token
 */
const verifyToken = async (req, res, next) => {
  try {
    let token = null;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Token requerido.',
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await Usuario.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido. Usuario no encontrado.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Inicia sesión nuevamente.',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Token inválido.',
    });
  }
};

module.exports = { verifyToken };
