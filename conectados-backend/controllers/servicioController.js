const { Servicio } = require('../models');

exports.createServicio = async (req, res) => {
  const { titulo, descripcion, precio, categoria, zona, duracion } = req.body;
  const prestadorId = req.user.id;  // viene del middleware

  if (!titulo || !descripcion || !precio || !categoria || !zona) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    const nuevo = await Servicio.create({
      prestadorId, titulo, descripcion, precio, categoria, zona, duracion
    });
    res.status(201).json(nuevo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear servicio.' });
  }
};

exports.getServicios = async (req, res) => {
  try {
    const lista = await Servicio.findAll({
      include: { association: 'prestador', attributes: ['id','nombre','correo'] }
    });
    res.json(lista);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al listar servicios.' });
  }
};
