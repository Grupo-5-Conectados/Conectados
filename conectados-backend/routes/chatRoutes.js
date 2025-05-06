// routes/chatRoutes.js
const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const {
  getChatHistory,
  sendMessage
} = require('../controllers/chatController');

const router = express.Router();

// GET  /api/chats/:servicioId       → historial
router.get('/:servicioId', verifyToken, getChatHistory);

// POST /api/chats/:servicioId       → enviar mensaje
router.post('/:servicioId', verifyToken, sendMessage);

module.exports = router;
