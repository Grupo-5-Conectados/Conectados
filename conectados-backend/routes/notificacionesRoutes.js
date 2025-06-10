const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');

router.get('/:usuarioId', notificacionController.getNotificaciones);
router.put('/:id/leida', notificacionController.marcarComoLeida);

module.exports = router;
