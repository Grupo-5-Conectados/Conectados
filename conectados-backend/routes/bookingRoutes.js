// routes/bookingRoutes.js

const express = require('express');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createBooking,
  listBookings,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');

const router = express.Router();

// Todas las rutas requieren token
router.use(verifyToken);

// Crear reserva (solo 'usuario')
router.post(
  '/',
  authorizeRoles('usuario'),
  createBooking
);

// Listar reservas (usuario o prestador)
router.get(
  '/',
  listBookings
);

// Confirmar/rechazar reserva (solo 'prestador')
router.patch(
  '/:id',
  authorizeRoles('prestador'),
  updateBooking
);

// Cancelar reserva pendiente (solo 'usuario')
router.delete(
  '/:id',
  authorizeRoles('usuario'),
  deleteBooking
);

module.exports = router;
