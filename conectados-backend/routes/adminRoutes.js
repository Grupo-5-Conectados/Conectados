// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Todas las rutas en /api/admin requieren token válido y rol 'admin'
router.use(verifyToken, authorizeRoles('admin'));

// GET /api/admin
router.get('/', (req, res) => {
  res.send('Admin panel funcionando');
});

module.exports = router;
