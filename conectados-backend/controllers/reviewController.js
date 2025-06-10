// controllers/reviewController.js
const { Review, Booking, Servicio, Usuario, Notificacion } = require('../models');

exports.createReview = async (req, res) => {
  const usuarioId = req.user.id;
  const { servicioId, puntuacion, comentario } = req.body;

  try {
    // Verifica que haya tenido una cita confirmada y pasada
    const reserva = await Booking.findOne({
      where: {
        usuarioId: req.user.id,
        servicioId,
        estado: 'realizada'
      }
    });

    if (!reserva) {
      return res.status(403).json({ code: 403, message: 'Solo puedes calificar si has recibido el servicio.' });
    }

    // Verifica que no haya calificado antes ese servicio
    const existente = await Review.findOne({ where: { usuarioId, servicioId } });
    if (existente) {
      return res.status(409).json({ code: 409, message: 'Ya has calificado este servicio.' });
    }

    const review = await Review.create({ usuarioId, servicioId, puntuacion, comentario });

    // Buscar el servicio para obtener el prestador
    const servicio = await Servicio.findByPk(servicioId);

    await Notificacion.create({
      usuarioId: servicio.prestadorId,
      tipo: 'review',
      mensaje: 'Has recibido una nueva calificación en uno de tus servicios.'
    });
    return res.status(201).json({ code: 201, data: review });
  } catch (error) {
    console.error('Error en createReview:', error);
    return res.status(500).json({ code: 500, message: 'Error al crear review.', details: error.message });
  }
};

exports.getReviewsByServicio = async (req, res) => {
  const servicioId = parseInt(req.params.id, 10);

  try {
    const reviews = await Review.findAll({
      where: { servicioId },
      include: [{ model: Usuario, as: 'usuario', attributes: ['id', 'nombre'] }]
    });

    return res.status(200).json({ code: 200, data: reviews });
  } catch (error) {
    console.error('Error en getReviewsByServicio:', error);
    return res.status(500).json({ code: 500, message: 'Error al obtener reviews.', details: error.message });
  }
};

// GET /api/reviews/mias
exports.getReviewsDelPrestador = async (req, res) => {
  const prestadorId = req.user.id;

  try {
    const servicios = await Servicio.findAll({
      where: { prestadorId },
      include: [{ model: Review, as: 'reviews' }]
    });

    // Aplanar todas las reviews
    const todasReviews = servicios.flatMap(servicio =>
      servicio.reviews.map(r => ({
        servicioTitulo: servicio.titulo,
        comentario: r.comentario,
        puntuacion: r.puntuacion
      }))
    );

    const promedio = todasReviews.length > 0
      ? (todasReviews.reduce((acc, r) => acc + r.puntuacion, 0) / todasReviews.length).toFixed(1)
      : null;

    res.status(200).json({
      code: 200,
      data: {
        promedio,
        reviews: todasReviews
      }
    });
  } catch (error) {
    console.error('Error en getReviewsDelPrestador:', error);
    res.status(500).json({ code: 500, message: 'Error al obtener reviews', details: error.message });
  }
};
