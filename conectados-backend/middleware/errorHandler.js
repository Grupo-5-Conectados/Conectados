// middleware/errorHandler.js

'use strict';
/**
 * Handler global de errores.
 * Envía JSON con { code, message, details? }.
 */
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const payload = {
    code: status,
    message: err.message || 'Error interno del servidor.'
  };
  if (err.details) {
    payload.details = err.details;
  }
  res.status(status).json(payload);
}

module.exports = errorHandler;
