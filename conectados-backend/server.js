require('dotenv').config();

const http = require('http');
const jwt  = require('jsonwebtoken');
const app  = require('./app');
const { sequelize } = require('./models');
const { Server }    = require('socket.io');

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || '*',
    methods: ['GET','POST']
  },
  transports: ['polling','websocket'],
  // NO override path a menos que lo configures igual en front
});

// Hacer io accesible desde controllers
app.set('io', io);

// Autenticación Socket.IO leyendo de handshake.auth.token
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('No autorizado'));
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = { id: payload.id, rol: payload.rol };
    next();
  } catch (err) {
    next(new Error('Token inválido'));
  }
});

io.on('connection', socket => {
  console.log('🔗 WS conectado:', socket.id, 'usuario:', socket.user.id);

  socket.on('joinRoom', ({ servicioId }) => {
    socket.join(`service_${servicioId}`);
    console.log(`→ Usuario ${socket.user.id} unido a room service_${servicioId}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ WS desconectado:', socket.id);
  });
});

(async () => {
  await sequelize.sync({ alter: true });
  server.listen(PORT, () => {
    console.log(`🚀 API+WS corriendo en http://localhost:${PORT}`);
  });
})();
