// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  createBooking,
  listBookings,
  updateBooking,
  deleteBooking
} = require('../controllers/bookingController');

// Todas las rutas /api/bookings requieren usuario autenticado
router.use(verifyToken);

// POST   /api/bookings     → crear reserva (usuario)
router.post('/', createBooking);

// GET    /api/bookings     → listar reservas (usuario o prestador)
router.get('/', listBookings);

// PATCH  /api/bookings/:id → confirmar/cancelar (solo prestador)
router.patch(
  '/:id',
  authorizeRoles('prestador'),
  updateBooking
);

// DELETE /api/bookings/:id → cancelar reserva pendiente (solo usuario)
router.delete(
  '/:id',
  authorizeRoles('usuario'),
  deleteBooking
);

module.exports = router;
