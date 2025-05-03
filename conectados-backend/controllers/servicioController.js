// controllers/servicioController.js

'use strict';
/**
 * Controlador de Servicios: CRUD y filtros para oferta de servicios.
 */
const { Servicio, Usuario } = require('../models');
const { Op } = require('sequelize');

// POST /servicios
// Crear un nuevo servicio (solo prestador)
exports.createServicio = async (req, res) => {
  const prestadorId = req.user.id;
  const { titulo, descripcion, precio, categoria, zona, duracion, imagenUrl } = req.body;

  if (!titulo || !descripcion || precio == null || !categoria || !zona) {
    return res.status(400).json({ code: 400, message: 'Faltan campos obligatorios.' });
  }

  try {
    const nuevo = await Servicio.create({
      prestadorId, titulo, descripcion, precio, categoria, zona, duracion, imagenUrl
    });
    return res.status(201).json({ code: 201, data: nuevo });
  } catch (error) {
    console.error('Error en createServicio:', error);
    return res.status(500).json({ code: 500, message: 'Error al crear servicio.', details: error.message });
  }
};

// GET /servicios
// Listar servicios con filtros opcionales y paginación
exports.getServicios = async (req, res) => {
  const { categoria, zona, precioMin, precioMax, duracionMin, duracionMax, limit = 20, offset = 0 } = req.query;
  const where = {};

  if (categoria)    where.categoria = categoria;
  if (zona)         where.zona      = zona;
  if (precioMin)    where.precio    = { ...where.precio, [Op.gte]: precioMin };
  if (precioMax)    where.precio    = { ...where.precio, [Op.lte]: precioMax };
  if (duracionMin)  where.duracion  = { ...where.duracion, [Op.gte]: duracionMin };
  if (duracionMax)  where.duracion  = { ...where.duracion, [Op.lte]: duracionMax };

  try {
    const lista = await Servicio.findAll({
      where,
      include: [{ model: Usuario, as: 'prestador', attributes: ['id','nombre','correo'] }],
      order: [['created_at','DESC']],
      limit:  parseInt(limit, 10),
      offset: parseInt(offset,10)
    });
    return res.status(200).json({ code: 200, data: lista });
  } catch (error) {
    console.error('Error en getServicios:', error);
    return res.status(500).json({ code: 500, message: 'Error al listar servicios.', details: error.message });
  }
};

// GET /servicios/:id
// Obtener detalle de un servicio
exports.getServicioById = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const servicio = await Servicio.findByPk(id, {
      include: [{ model: Usuario, as: 'prestador', attributes: ['id','nombre','correo'] }]
    });
    if (!servicio) {
      return res.status(404).json({ code: 404, message: 'Servicio no encontrado.' });
    }
    return res.status(200).json({ code: 200, data: servicio });
  } catch (error) {
    console.error('Error en getServicioById:', error);
    return res.status(500).json({ code: 500, message: 'Error al obtener servicio.', details: error.message });
  }
};

// PUT /servicios/:id
// Actualizar un servicio existente (solo su prestador)
exports.updateServicio = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const servicio = await Servicio.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ code: 404, message: 'Servicio no encontrado.' });
    }
    if (servicio.prestadorId !== req.user.id) {
      return res.status(403).json({ code: 403, message: 'No autorizado.' });
    }

    const { titulo, descripcion, precio, categoria, zona, duracion, imagenUrl } = req.body;
    await servicio.update({ titulo, descripcion, precio, categoria, zona, duracion, imagenUrl });
    return res.status(200).json({ code: 200, data: servicio });
  } catch (error) {
    console.error('Error en updateServicio:', error);
    return res.status(500).json({ code: 500, message: 'Error al actualizar servicio.', details: error.message });
  }
};

// DELETE /servicios/:id
// Eliminar un servicio (solo su prestador)
exports.deleteServicio = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const servicio = await Servicio.findByPk(id);
    if (!servicio) {
      return res.status(404).json({ code: 404, message: 'Servicio no encontrado.' });
    }
    if (servicio.prestadorId !== req.user.id) {
      return res.status(403).json({ code: 403, message: 'No autorizado.' });
    }
    await servicio.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Error en deleteServicio:', error);
    return res.status(500).json({ code: 500, message: 'Error al eliminar servicio.', details: error.message });
  }
};
