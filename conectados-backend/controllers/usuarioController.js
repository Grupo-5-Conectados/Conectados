// controllers/usuarioControllers.js

'use strict';
/**
 * Controlador de Usuarios: operaciones de perfil y administración.
 */
const { Review, Servicio, Usuario } = require('../models');

// GET /me
// Obtener perfil del usuario autenticado
exports.getMe = async (req, res) => {
  try {
    const { id, nombre, correo, rol, fecha_registro } = req.user;
    return res.status(200).json({ code: 200, data: { id, nombre, correo, rol, fecha_registro } });
  } catch (error) {
    console.error('Error en getMe:', error);
    return res.status(500).json({ code: 500, message: 'Error al obtener perfil.', details: error.message });
  }
};

// GET /usuarios
// Listar todos los usuarios (solo admin)
exports.getUsuarios = async (req, res) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ code: 403, message: 'No autorizado.' });
  }
  try {
    const usuarios = await Usuario.findAll({
      attributes: ['id', 'nombre', 'correo', 'rol', 'fecha_registro']
    });
    return res.status(200).json({ code: 200, data: usuarios });
  } catch (error) {
    console.error('Error en getUsuarios:', error);
    return res.status(500).json({ code: 500, message: 'Error al obtener usuarios.', details: error.message });
  }
};

// GET /usuarios/:id
// Obtener un usuario por ID (admin o mismo usuario)
exports.getUsuarioById = async (req, res) => {
  const targetId = parseInt(req.params.id, 10);
  if (req.user.rol !== 'admin' && req.user.id !== targetId) {
    return res.status(403).json({ code: 403, message: 'No autorizado.' });
  }
  try {
    const usuario = await Usuario.findByPk(targetId, {
      attributes: ['id', 'nombre', 'correo', 'rol', 'fecha_registro']
    });
    if (!usuario) {
      return res.status(404).json({ code: 404, message: 'Usuario no encontrado.' });
    }
    const usuarioData = usuario.toJSON();
    // Si el usuario es prestador, calcular su rating promedio global
    if (usuario.rol === 'prestador') {
      // Obtener todos sus servicios
      const servicios = await Servicio.findAll({ where: { prestadorId: usuario.id } });

      const servicioIds = servicios.map(s => s.id);

      // Obtener todas las reviews de sus servicios
      const reviews = await Review.findAll({
        where: { servicioId: servicioIds }
      });

      const rating_promedio_global = reviews.length > 0
        ? (reviews.reduce((sum, r) => sum + r.puntuacion, 0) / reviews.length).toFixed(2)
        : null;

      usuarioData.rating_promedio_global = rating_promedio_global;
      usuarioData.total_reviews_global = reviews.length;
    }

    return res.status(200).json({ code: 200, data: usuarioData });

  } catch (error) {
    console.error('Error en getUsuarioById:', error);
    return res.status(500).json({ code: 500, message: 'Error al buscar usuario.', details: error.message });
  }
};

// PUT /me
// Actualizar propio perfil
exports.updateMe = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id);
    const { nombre, correo, password } = req.body;
    await usuario.update({ nombre, correo, password });
    const { id, rol, fecha_registro } = usuario;
    return res.status(200).json({
      code: 200,
      data: { id, nombre: usuario.nombre, correo: usuario.correo, rol, fecha_registro }
    });
  } catch (error) {
    console.error('Error en updateMe:', error);
    return res.status(500).json({ code: 500, message: 'Error al actualizar perfil.', details: error.message });
  }
};

// PUT /usuarios/:id
// Actualizar usuario por ID (solo admin)
exports.updateUsuario = async (req, res) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ code: 403, message: 'No autorizado.' });
  }
  const targetId = parseInt(req.params.id, 10);
  try {
    const usuario = await Usuario.findByPk(targetId);
    if (!usuario) {
      return res.status(404).json({ code: 404, message: 'Usuario no encontrado.' });
    }
    const { nombre, correo, rol } = req.body;
    await usuario.update({ nombre, correo, rol });
    return res.status(200).json({
      code: 200,
      data: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        fecha_registro: usuario.fecha_registro
      }
    });
  } catch (error) {
    console.error('Error en updateUsuario:', error);
    return res.status(500).json({ code: 500, message: 'Error al actualizar usuario.', details: error.message });
  }
};

// DELETE /usuarios/:id
// Eliminar usuario por ID (solo admin)
exports.deleteUsuario = async (req, res) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ code: 403, message: 'No autorizado.' });
  }
  const targetId = parseInt(req.params.id, 10);
  try {
    const usuario = await Usuario.findByPk(targetId);
    if (!usuario) {
      return res.status(404).json({ code: 404, message: 'Usuario no encontrado.' });
    }
    await usuario.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error('Error en deleteUsuario:', error);
    return res.status(500).json({ code: 500, message: 'Error al eliminar usuario.', details: error.message });
  }
};

// GET /api/mis-reviews
// Devuelve las reseñas que han recibido los servicios del prestador logueado


exports.getMisReviews = async (req, res) => {
  if (req.user.rol !== 'prestador') {
    return res.status(403).json({ code: 403, message: 'Solo disponible para prestadores.' });
  }

  try {
    // 1. Buscar los servicios del prestador
    const servicios = await Servicio.findAll({
      where: { prestadorId: req.user.id },
      attributes: ['id', 'titulo']
    });

    const servicioIds = servicios.map(s => s.id);

    // 2. Obtener reviews de esos servicios
    const reviews = await Review.findAll({
      where: { servicioId: servicioIds },
      include: [
        { model: Usuario, as: 'usuario', attributes: ['id', 'nombre'] },
        { model: Servicio, as: 'servicio', attributes: ['id', 'titulo'] }
      ],
      order: [['created_at', 'DESC']]
    });

    // 3. Calcular promedio de puntuación
    const total = reviews.reduce((sum, r) => sum + r.puntuacion, 0);
    const promedio = reviews.length ? (total / reviews.length).toFixed(1) : null;

    return res.status(200).json({ code: 200, data: { promedio, reviews } });
  } catch (error) {
    console.error('Error en getMisReviews:', error);
    return res.status(500).json({ code: 500, message: 'Error al obtener reviews.', details: error.message });
  }
};
