// routes/usuarioRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');
const validarUsuario = require('../middleware/validarUsuario');
const {
  getMe,
  getUsuarios,
  getUsuarioById,
  updateMe,
  updateUsuario,
  deleteUsuario,
  getMisReviews
} = require('../controllers/usuarioController');

// Rutas que requieren autenticación
router.get('/me', verifyToken, getMe);
router.put('/me', validarUsuario, verifyToken, updateMe);
router.get('/mis-reviews', verifyToken, getMisReviews); 
// Rutas solo para admin
router.use(verifyToken, authorizeRoles('admin'));
router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.put('/:id', validarUsuario, updateUsuario);
router.delete('/:id', deleteUsuario);



module.exports = router;