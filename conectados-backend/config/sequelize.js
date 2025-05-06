// config/sequelize.js
/**
 * Configuración de Sequelize para entornos Development, Test y Production.
 * Variables de entorno:
 *  - DB_HOST
 *  - DB_USER
 *  - DB_PASSWORD
 *  - DB_NAME
 *  - DB_NAME_TEST
 *  - DB_NAME_PROD
 */
require('dotenv').config();

const common = {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Cambiar según tus necesidades de seguridad
    }
  }
};

// Validar que exista el host
if (!common.host) {
  console.error('❌ Faltan variables de entorno obligatorias: DB_HOST.');
  process.exit(1);
}

module.exports = {
  development: {
    ...common,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME
  },
  test: {
    ...common,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME_TEST || `${process.env.DB_NAME}_test`
  },
  production: {
    ...common,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME_PROD || `${process.env.DB_NAME}_prod`
  }
};