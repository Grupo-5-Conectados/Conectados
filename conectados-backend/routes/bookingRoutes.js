const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
  createBooking,
  listBookings,
  updateBooking
} = require('../controllers/bookingController');

router.use(verifyToken);

// POST /api/bookings        → crear reserva
router.post('/', createBooking);

// GET  /api/bookings        → listar (usuario o prestador)
router.get('/', listBookings);

// PATCH /api/bookings/:id   → actualizar estado
router.patch('/:id', updateBooking);

module.exports = router;
