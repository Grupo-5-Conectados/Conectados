// routes/servicioRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createServicio,
  getServicios,
  getServicioById,
  updateServicio,
  deleteServicio
} = require('../controllers/servicioController');

// GET    /api/servicios         → lista pública con filtros
router.get('/', getServicios);

// GET    /api/servicios/:id     → detalle público
router.get('/:id', getServicioById);

// POST   /api/servicios         → crear servicio (solo prestador)
router.post(
  '/',
  verifyToken,
  authorizeRoles('prestador'),
  createServicio
);

// PUT    /api/servicios/:id     → actualizar (solo prestador)
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('prestador'),
  updateServicio
);

// DELETE /api/servicios/:id     → eliminar (solo prestador)
router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('prestador'),
  deleteServicio
);

module.exports = router;
