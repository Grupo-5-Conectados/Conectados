const express = require('express');
const router = express.Router();

const { getUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario } = require('../controllers/usuarioController');

// Obtener todos los usuarios
router.get('/', getUsuarios);

// Obtener un usuario específico
router.get('/:id', getUsuarioById);

// Crear un nuevo usuario
router.post('/', createUsuario);

// Actualizar un usuario
router.put('/:id', updateUsuario);

// Eliminar un usuario
router.delete('/:id', deleteUsuario);

module.exports = router;
