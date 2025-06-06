// controllers/bookingController.js
'use strict';
const { Booking, Servicio, Usuario, Disponibilidad } = require('../models');

/**
 * POST /api/bookings
 * Crear una reserva (solo usuario)
 */
exports.createBooking = async (req, res) => {
  const usuarioId = req.user.id;
  const { servicioId, fecha_hora } = req.body;

  if (!servicioId || !fecha_hora) {
    return res.status(400).json({ code: 400, message: 'Faltan campos obligatorios.' });
  }

  try {
    const servicio = await Servicio.findByPk(servicioId);
    if (!servicio) {
      return res.status(404).json({ code: 404, message: 'Servicio no encontrado.' });
    }

    // Verificar slot todavía disponible
    const slot = await Disponibilidad.findOne({
      where: { servicioId, fecha_hora, disponible: true }
    });
    if (!slot) {
      return res.status(409).json({ code: 409, message: 'Ese horario ya no está disponible.' });
    }

    // Marcar slot como no disponible
    await slot.update({ disponible: false });

    const nueva = await Booking.create({ usuarioId, servicioId, fecha_hora });
    return res.status(201).json({ code: 201, data: nueva });
  } catch (error) {
    console.error('Error en createBooking:', error);
    return res.status(500).json({
      code: 500,
      message: 'Error al crear reserva.',
      details: error.message
    });
  }
};

/**
 * GET /api/bookings
 * Listar reservas:
 *  - si rol=prestador: solo reservas de sus servicios
 *  - si rol=usuario: solo sus propias reservas
 */
exports.listBookings = async (req, res) => {
  const { rol, id: usuarioId } = req.user;

  try {
    let bookings;
    if (rol === 'prestador') {
      // Incluye solo las reservas cuyo servicio pertenece al prestador
      bookings = await Booking.findAll({
        include: [
          {
            model: Servicio,
            as: 'servicio',
            where: { prestadorId: usuarioId },
            attributes: ['id', 'titulo', 'prestadorId']
          },
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'correo']
          }
        ],
        order: [['fecha_hora', 'ASC']]
      });
    } else {
      // Usuario normal ve solo sus reservas
      bookings = await Booking.findAll({
        where: { usuarioId },
        include: [
          {
            model: Servicio,
            as: 'servicio',
            attributes: ['id', 'titulo', 'prestadorId']
          },
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'correo']
          }
        ],
        order: [['fecha_hora', 'ASC']]
      });
    }

    return res.status(200).json({ code: 200, data: bookings });
  } catch (error) {
    console.error('Error en listBookings:', error);
    return res.status(500).json({
      code: 500,
      message: 'Error al listar reservas.',
      details: error.message
    });
  }
};

/**
 * PATCH /api/bookings/:id
 * Confirmar/cancelar/marcar como realizada (solo prestador dueño del servicio)
 */
exports.updateBooking = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;
  const usuarioId = req.user.id;

  try {
    const reserva = await Booking.findByPk(id, {
      include: {
        model: Servicio,
        as: 'servicio'
      }
    });

    if (!reserva) {
      return res.status(404).json({ message: 'Reserva no encontrada' });
    }

    // Validar que el usuario sea el dueño del servicio
    if (req.user.rol !== 'prestador' || reserva.servicio.prestadorId !== usuarioId) {
      return res.status(403).json({ message: 'No autorizado para modificar esta reserva' });
    }

    // Validar transiciones permitidas
    const transicionesValidas = {
      pendiente: ['confirmada', 'cancelada'],
      confirmada: ['realizada', 'cancelada'],
      realizada: [],
      cancelada: []
    };

    if (!transicionesValidas[reserva.estado]?.includes(estado)) {
      return res.status(400).json({ message: `No se puede pasar de '${reserva.estado}' a '${estado}'` });
    }

    reserva.estado = estado;
    await reserva.save();
    res.json(reserva);

  } catch (err) {
    console.error('Error en updateBooking:', err);
    res.status(500).json({ message: 'Error al actualizar la reserva', error: err.message });
  }
};

/**
 * DELETE /api/bookings/:id
 * Cancelar reserva pendiente (solo usuario creador)
 */
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
      return res.status(400).json({ code: 400, message: 'Solo reservas pendientes pueden cancelarse.' });
    }

    // Liberar slot
    await Disponibilidad.update(
      { disponible: true },
      { where: { servicioId: booking.servicioId, fecha_hora: booking.fecha_hora } }
    );

    await booking.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Error en deleteBooking:', error);
    return res.status(500).json({
      code: 500,
      message: 'Error al eliminar reserva.',
      details: error.message
    });
  }
};
