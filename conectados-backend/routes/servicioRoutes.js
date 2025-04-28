const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createServicio, getServicios } = require('../controllers/servicioController');

// GET /api/servicios  → lista pública
router.get('/', getServicios);

// POST /api/servicios → crea nuevo (protegido)
router.post('/', verifyToken, createServicio);

module.exports = router;
