// app.js
require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const { sequelize } = require('./models');
const authRoutes           = require('./routes/authRoutes');
const servicioRoutes       = require('./routes/servicioRoutes');
const bookingRoutes        = require('./routes/bookingRoutes');
const usuarioRoutes        = require('./routes/usuarioRoutes');
const adminRoutes          = require('./routes/adminRoutes');
const disponibilidadRoutes = require('./routes/disponibilidadRoutes');
const chatRoutes           = require('./routes/chatRoutes');
const errorHandler         = require('./middleware/errorHandler');
const reviewRoutes         = require('./routes/reviewRoutes');
const app = express();

// 1) Seguridad y logging
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// 2) Parseo JSON
app.use(express.json());

// 3) Montar APIs
app.use('/api/auth',         authRoutes);
app.use('/api/servicios',     servicioRoutes);
app.use('/api/bookings',      bookingRoutes);
app.use('/api/usuarios',      usuarioRoutes);
app.use('/api/admin',         adminRoutes);
app.use('/api', disponibilidadRoutes);
app.use('/api/chats',         chatRoutes);
app.use('/api/reviews',      reviewRoutes);

// 4) Health-check
app.get('/', (req, res) => res.send('API Conectados funcionando 👋'));

// 5) 404
app.use((req, res) => res.status(404).json({ code:404, message:'Recurso no encontrado.' }));

// 6) Error handler
app.use(errorHandler);

module.exports = app;
