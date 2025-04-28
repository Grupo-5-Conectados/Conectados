const { Booking, Servicio } = require('../models');

exports.createBooking = async (req, res) => {
  const { servicioId, fecha_hora } = req.body;
  const usuarioId = req.user.id;

  if (!servicioId || !fecha_hora) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  // 1) Validar que el servicio exista
  const servicio = await Servicio.findByPk(servicioId);
  if (!servicio) {
    return res.status(404).json({ error: 'Servicio no encontrado.' });
  }

  // 2) Comprobar que no haya otra reserva en ese instante
  const conflict = await Booking.findOne({
    where: { servicioId, fecha_hora, estado: 'confirmada' }
  });
  if (conflict) {
    return res.status(409).json({ error: 'Horario ya reservado.' });
  }

  // 3) Crear la reserva (queda en estado 'pendiente')
  const nueva = await Booking.create({ usuarioId, servicioId, fecha_hora });
  res.status(201).json(nueva);
};

exports.listBookings = async (req, res) => {
  const { rol, id } = req.user;

  // Si es prestador, ver sus bookings; si es usuario, ver los suyos
  const where = rol === 'prestador'
    ? { '$servicio.prestadorId$': id }
    : { usuarioId: id };

  const lista = await Booking.findAll({
    where,
    include: [
      { association: 'servicio', attributes: ['id','titulo'], include: ['prestador'] },
      { association: 'usuario',  attributes: ['id','nombre','correo'] }
    ],
    order: [['fecha_hora','ASC']]
  });

  res.json(lista);
};

exports.updateBooking = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  // Solo prestador puede confirmar o cancelar
  if (!['confirmada','cancelada'].includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido.' });
  }

  const booking = await Booking.findByPk(id);
  if (!booking) return res.status(404).json({ error: 'Reserva no existe.' });

  // Solo el prestador del servicio puede cambiar estado
  if (req.user.rol !== 'prestador' || req.user.id !== booking.servicioId) {
    return res.status(403).json({ error: 'No autorizado.' });
  }

  booking.estado = estado;
  await booking.save();
  res.json(booking);
};
