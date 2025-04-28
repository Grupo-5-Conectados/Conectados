require('dotenv').config();            // ← Carga .env antes de todo
const express = require('express');
const cors = require('cors');

// Importamos Sequelize desde models/index.js
const { sequelize } = require('./models');

// Rutas
const authRoutes = require('./routes/authRoutes');
const servicioRoutes = require('./routes/servicioRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/servicios', servicioRoutes);
app.use('/api/usuarios', usuarioRoutes);
// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API Conectados funcionando 👋');
});

// Sincronizar modelos con la base de datos
sequelize
  .sync({ alter: true })   // Crea o ajusta tablas para que coincidan con tus modelos
  .then(() => {
    console.log('✅ Tablas sincronizadas en la BD');
  })
  .catch(err => {
    console.error('❌ Error sincronizando la BD:', err);
  });

module.exports = app;
