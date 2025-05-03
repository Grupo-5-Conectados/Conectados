// middleware/authMiddleware.js

'use strict';
/**
 * Middleware de autenticación y autorización basado en JWT.
 * - verifyToken: extrae y verifica el token, carga req.user.
 * - authorizeRoles: comprueba que req.user.rol esté en la lista permitida.
 */

require('dotenv').config();
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error('❌ Error: no se definió JWT_SECRET en las variables de entorno.');
  process.exit(1);
}

/**
 * Verifica el token Bearer en Authorization header.
 * Si es válido, carga req.user = { id, correo, rol }.
 * En caso de error, pasa un objeto error al next() para el handler global.
 */
async function verifyToken(req, res, next) {
  try {
    const header = req.headers['authorization'];
    if (!header || !header.startsWith('Bearer ')) {
      throw { status: 401, message: 'Token faltante o mal formado.' };
    }

    const token = header.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);

    // Carga mínimo info de usuario en req.user
    const user = await Usuario.findByPk(payload.id, {
      attributes: ['id', 'correo', 'rol']
    });
    if (!user) {
      throw { status: 401, message: 'Usuario no existe.' };
    }

    req.user = {
      id: user.id,
      correo: user.correo,
      rol: user.rol
    };
    next();
  } catch (err) {
    // JWT errors vienen como JsonWebTokenError / TokenExpiredError
    if (err.name === 'TokenExpiredError') {
      return next({ status: 401, message: 'Token expirado.' });
    }
    if (err.name === 'JsonWebTokenError') {
      return next({ status: 401, message: 'Token inválido.' });
    }
    // Errores lanzados manualmente tienen status y message
    next(err);
  }
}

/**
 * Factory de middleware para autorización por rol:
 * usage: app.get('/ruta', verifyToken, authorizeRoles('admin','prestador'), handler)
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next({ status: 401, message: 'No autenticado.' });
    }
    if (!allowedRoles.includes(req.user.rol)) {
      return next({ status: 403, message: 'Acceso prohibido para tu rol.' });
    }
    next();
  };
}

module.exports = {
  verifyToken,
  authorizeRoles
};
