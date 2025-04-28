// routes/authRoutes.js

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/test-db  (dejamos tu prueba de conexión)
router.get('/test-db', async (req, res) => {
  const db = require('../config/db');
  try {
    const [rows] = await db.query('SELECT NOW() AS hora_actual');
    res.json({ conexion: 'ok', hora: rows[0].hora_actual });
  } catch (err) {
    res.status(500).json({ conexion: 'fallida', error: err.message });
  }
});

module.exports = router;
