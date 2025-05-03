// controllers/bookingController.js

'use strict';
/**
 * Controlador de Reservas (Booking):
 * - createBooking: crear nueva reserva (estado 'pendiente').
 * - listBookings: listar reservas de usuario o prestador.
 * - updateBooking: confirmar/cancelar reserva (solo prestador).
 * - deleteBooking: cancelar reserva pendiente (solo usuario).
 */
const { Booking, Servicio } = require('../models');


// POST /bookings
// Crear una reserva para un servicio
exports.createBooking = async (req, res) => {
  const usuarioId  = req.user.id;
  const { servicioId, fecha_hora } = req.body;

  if (!servicioId || !fecha_hora) {
    return res.status(400).json({ code: 400, message: 'Faltan campos obligatorios.' });
  }

  try {
    // Validar existencia de servicio
    const servicio = await Servicio.findByPk(servicioId);
    if (!servicio) {
      return res.status(404).json({ code: 404, message: 'Servicio no encontrado.' });
    }

    // Evitar doble reserva confirmada
    const conflict = await Booking.findOne({
      where: { servicioId, fecha_hora, estado: 'confirmada' }
    });
    if (conflict) {
      return res.status(409).json({ code: 409, message: 'Horario ya reservado.' });
    }

    const nueva = await Booking.create({ usuarioId, servicioId, fecha_hora });
    return res.status(201).json({ code: 201, data: nueva });
  } catch (error) {
    console.error('Error en createBooking:', error);
    return res.status(500).json({ code: 500, message: 'Error al crear reserva.', details: error.message });
  }
};


// GET /bookings
// Listar reservas: si es prestador -> sus servicios; si es usuario -> propias
exports.listBookings = async (req, res) => {
  const { rol, id: usuarioId } = req.user;
  const where = rol === 'prestador'
    ? { '$servicio.prestadorId$': usuarioId }
    : { usuarioId };

  try {
    const lista = await Booking.findAll({
      where,
      include: [
        { association: 'servicio', attributes: ['id','titulo'], include: ['prestador'] },
        { association: 'usuario',  attributes: ['id','nombre','correo'] }
      ],
      order: [['fecha_hora','ASC']]
    });
    return res.status(200).json({ code: 200, data: lista });
  } catch (error) {
    console.error('Error en listBookings:', error);
    return res.status(500).json({ code: 500, message: 'Error al listar reservas.', details: error.message });
  }
};


// PUT /bookings/:id
// Confirmar o cancelar reserva (solo prestador dueño del servicio)
exports.updateBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id, 10);
  const { estado } = req.body;
  const validos = ['confirmada','cancelada'];

  if (!validos.includes(estado)) {
    return res.status(400).json({ code: 400, message: 'Estado inválido.' });
  }

  try {
    const booking = await Booking.findByPk(bookingId, {
      include: { association: 'servicio', attributes: ['prestadorId'] }
    });
    if (!booking) {
      return res.status(404).json({ code: 404, message: 'Reserva no existe.' });
    }
    if (req.user.rol !== 'prestador' || booking.servicio.prestadorId !== req.user.id) {
      return res.status(403).json({ code: 403, message: 'No autorizado.' });
    }

    booking.estado = estado;
    await booking.save();
    return res.status(200).json({ code: 200, data: booking });
  } catch (error) {
    console.error('Error en updateBooking:', error);
    return res.status(500).json({ code: 500, message: 'Error al actualizar reserva.', details: error.message });
  }
};


// DELETE /bookings/:id
// Cancelar reserva pendiente (solo usuario que la creó)
exports.deleteBooking = async (req, res) => {
  const bookingId = parseInt(req.params.id, 10);

  try {
    const booking = await Booking.findByPk(bookingId);
    if (!booking) {
      return res.status(404).json({ code: 404, message: 'Reserva no existe.' });
    }
    if (req.user.rol !== 'usuario' || booking.usuarioId !== req.user.id) {
      return res.status(403).json({ code: 403, message: 'No autorizado.' });
    }
    if (booking.estado !== 'pendiente') {
      return res.status(400).json({ code: 400, message: 'Solo reservas pendientes pueden ser canceladas.' });
    }

    await booking.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Error en deleteBooking:', error);
    return res.status(500).json({ code: 500, message: 'Error al eliminar reserva.', details: error.message });
  }
};
