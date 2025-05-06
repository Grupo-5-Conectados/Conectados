// routes/disponibilidadRoutes.js
const express = require('express');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  addSlot,
  getSlots,
  deleteSlot
} = require('../controllers/disponibilidadController');

const router = express.Router();

// 1) Crear slot – solo prestador
router.post(
  '/servicios/:id/slots',
  verifyToken,
  authorizeRoles('prestador'),
  addSlot
);

// 2) Listar slots disponibles – cualquier usuario autenticado
router.get(
  '/servicios/:id/slots',
  verifyToken,
  getSlots
);

// 3) Eliminar slot – solo prestador
router.delete(
  '/slots/:id',
  verifyToken,
  authorizeRoles('prestador'),
  deleteSlot
);

module.exports = router;
