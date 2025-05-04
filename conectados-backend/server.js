require('dotenv').config();
const http = require('http'); // Importar módulo HTTP
const { Server } = require('socket.io'); // Importar Socket.io
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

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