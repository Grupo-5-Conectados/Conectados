require('dotenv').config();
<<<<<<< HEAD
const http = require('http');
const jwt  = require('jsonwebtoken');
const app  = require('./app');
=======
const http = require('http'); // Importar módulo HTTP
const { Server } = require('socket.io'); // Importar Socket.io
const app = require('./app');
>>>>>>> aa3f525ad2646211fc8c2499457eabb78489ce89
const { sequelize } = require('./models');
const { Server }    = require('socket.io');

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);

<<<<<<< HEAD
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
=======
// Crear servidor HTTP
const server = http.createServer(app);

// Configurar Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Permitir conexiones desde cualquier origen (ajusta según sea necesario)
  },
});

// Manejar eventos de conexión de Socket.io
io.on('connection', (socket) => {
  console.log(`🔗 Usuario conectado: ${socket.id}`);

  // Escuchar eventos personalizados (opcional)
  socket.on('mensaje', (data) => {
    console.log(`📩 Mensaje recibido de ${socket.id}:`, data);
  });

  // Manejar desconexión
  socket.on('disconnect', () => {
    console.log(`❌ Usuario desconectado: ${socket.id}`);
  });
});

// Sincronizar modelos y arrancar servidor
(async () => {
  try {
    await sequelize.authenticate();
    console.log('🔗 Conexión a la BD establecida correctamente.');
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas en la BD');

    // Iniciar el servidor HTTP
    server.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar la BD o servidor:', err);
    process.exit(1);
  }
})();
>>>>>>> aa3f525ad2646211fc8c2499457eabb78489ce89
