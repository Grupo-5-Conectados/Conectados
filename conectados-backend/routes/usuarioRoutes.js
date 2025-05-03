// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const {
  getMe,
  getUsuarios,
  getUsuarioById,
  updateMe,
  updateUsuario,
  deleteUsuario
} = require('../controllers/usuarioController');

// Rutas públicas (no requieren autenticación)
// router.post('/register', register); // Si tienes registro público

// Rutas que requieren autenticación pero no necesariamente ser admin
router.get('/me', verifyToken, getMe); // Mover esta ruta antes del middleware de admin
router.put('/me', verifyToken, updateMe); // Para actualizar el propio perfil

// Rutas que requieren ser admin (se aplica el middleware a todas las siguientes)
router.use(verifyToken, authorizeRoles('admin'));

// GET    /api/usuarios         → listar todos (solo admin)
router.get('/', getUsuarios);

// GET    /api/usuarios/:id     → ver usuario por ID (solo admin)
router.get('/:id', getUsuarioById);

// PUT    /api/usuarios/:id     → actualizar usuario (solo admin)
router.put('/:id', updateUsuario);

// DELETE /api/usuarios/:id     → eliminar usuario (solo admin)
router.delete('/:id', deleteUsuario);

module.exports = router;