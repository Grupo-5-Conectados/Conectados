// app.js
require('dotenv').config();            // ← Carga .env antes de todo
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Importamos Sequelize desde models/index.js
const { sequelize } = require('./models');

// Importamos rutas
const authRoutes      = require('./routes/authRoutes');
const servicioRoutes  = require('./routes/servicioRoutes');
const bookingRoutes   = require('./routes/bookingRoutes');
const usuarioRoutes   = require('./routes/usuarioRoutes');
const adminRoutes     = require('./routes/adminRoutes');

// Importamos middleware
const errorHandler    = require('./middleware/errorHandler');

const app = express();

// 1) Seguridad y logging
app.use(helmet());                     // Cabeceras seguras
app.use(morgan('dev'));                // Logs HTTP
app.use(cors({                         // CORS configurado
  origin: process.env.CORS_ORIGINS?.split(',') || '*',
  methods: ['GET','POST','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// 2) Parseo de JSON
app.use(express.json());

// 3) Swagger UI (opcional), si tienes el openapi.yaml
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./openapi.yaml');
// app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 4) Endpoints versionados
app.use('/api/auth',      authRoutes);
app.use('/api/servicios',  servicioRoutes);
app.use('/api/bookings',   bookingRoutes);
app.use('/api/usuarios',   usuarioRoutes);
app.use('/api/admin',      adminRoutes);

// 5) Ruta raíz
app.get('/', (req, res) => {
  res.send('API Conectados funcionando 👋');
});

// 6) 404 para rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ code: 404, message: 'Recurso no encontrado.' });
});

// 7) Middleware global de errores
app.use(errorHandler);

module.exports = app;
