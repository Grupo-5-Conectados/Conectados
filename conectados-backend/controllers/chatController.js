// controllers/chatController.js
const { ChatMessage } = require('../models');

exports.getChatHistory = async (req, res) => {
  try {
    const servicioId = +req.params.servicioId;
    const messages = await ChatMessage.findAll({
      where: { servicioId },
      order: [['created_at','ASC']],
      include: ['fromUser','toUser']
    });
    return res.json({ code:200, data: messages });
  } catch (error) {
    console.error('Error getting chat history:', error);
    return res.status(500).json({ code:500, message:'Error al obtener el historial' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const servicioId = +req.params.servicioId;
    const fromUserId = req.user.id;
    const { toUserId, content } = req.body;
    
    if (!toUserId || !content) {
      return res.status(400).json({ code:400, message:'Faltan campos.' });
    }

    const msg = await ChatMessage.create({ 
      servicioId, 
      fromUserId, 
      toUserId, 
      content 
    });

    // Cargar relaciones para emitir el mensaje completo
    const fullMsg = await ChatMessage.findByPk(msg.id, {
      include: ['fromUser','toUser']
    });

    const io = req.app.get('io');
    io.to(`service_${servicioId}`).emit('message', fullMsg);

    return res.status(201).json({ code:201, data: fullMsg });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ code:500, message:'Error al enviar mensaje' });
  }
};
