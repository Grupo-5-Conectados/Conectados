// controllers/disponibilidadController.js

const { Disponibilidad, Servicio } = require('../models');

exports.addSlot = async (req, res) => {
  const prestadorId = req.user.id;
  const servicioId  = parseInt(req.params.id, 10);
  const { fecha_hora } = req.body;

  if (!fecha_hora) {
    return res.status(400).json({ code: 400, message: 'Falta campo fecha_hora.' });
  }

  try {
    // 1) Verificar que el servicio exista y pertenezca al prestador
    const servicio = await Servicio.findByPk(servicioId);
    if (!servicio || servicio.prestadorId !== prestadorId) {
      return res.status(403).json({ code: 403, message: 'Servicio no encontrado o no autorizado.' });
    }

    // 2) Crear el nuevo slot
    const slot = await Disponibilidad.create({ prestadorId, servicioId, fecha_hora });
    return res.status(201).json({ code: 201, data: slot });
  } catch (err) {
    console.error('Error en addSlot:', err);

    // 3) Control de duplicados
    if (err.name === 'SequelizeUniqueConstraintError' || err.original?.errno === 1062) {
      return res.status(409).json({ code: 409, message: 'Ya existe este horario disponible.' });
    }

    return res.status(500).json({
      code: 500,
      message: 'Error al agregar slot.',
      details: err.message
    });
  }
};

exports.getSlots = async (req, res) => {
  const servicioId = parseInt(req.params.id, 10);

  try {
    const slots = await Disponibilidad.findAll({
      where: { servicioId, disponible: true },
      order: [['fecha_hora', 'ASC']]
    });
    return res.status(200).json({ code: 200, data: slots });
  } catch (err) {
    console.error('Error en getSlots:', err);
    return res.status(500).json({
      code: 500,
      message: 'Error al obtener slots.',
      details: err.message
    });
  }
};

exports.deleteSlot = async (req, res) => {
  const slotId = parseInt(req.params.id, 10);

  try {
    const slot = await Disponibilidad.findByPk(slotId);
    if (!slot || slot.prestadorId !== req.user.id) {
      return res.status(403).json({ code: 403, message: 'No autorizado.' });
    }

    await slot.destroy();
    return res.status(204).send();
  } catch (err) {
    console.error('Error en deleteSlot:', err);
    return res.status(500).json({
      code: 500,
      message: 'Error al eliminar slot.',
      details: err.message
    });
  }
};
