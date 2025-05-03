// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Registro e inicio de sesión públicos
router.post('/register', register);
router.post('/login',    login);

// GET /api/auth/test-db  → solo para debugging de conexión (requiere token)
router.get('/test-db', verifyToken, async (req, res) => {
  const db = require('../config/db');
  try {
    const [rows] = await db.query('SELECT NOW() AS hora_actual');
    res.json({ conexion: 'ok', hora: rows[0].hora_actual });
  } catch (err) {
    res.status(500).json({ conexion: 'fallida', error: err.message });
  }
});

module.exports = router;
