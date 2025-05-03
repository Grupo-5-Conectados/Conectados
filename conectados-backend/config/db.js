// config/db.js
/**
 * Configuración de la conexión a MySQL usando mysql2/promise.
 * Variables de entorno necesarias: DB_HOST, DB_USER, DB_PASSWORD, DB_NAME.
 */
require('dotenv').config();

const mysql = require('mysql2/promise');

// Validación de variables de entorno
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
if (!DB_HOST || !DB_USER || !DB_NAME) {
  console.error('❌ Faltan variables de entorno obligatorias: DB_HOST, DB_USER o DB_NAME.');
  process.exit(1);
}

console.log('🔗 Conectando a MySQL en', DB_HOST);

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,   // aseguran que espere por conexiones libres
  connectionLimit: 10,        // controla número máximo de conexiones simultáneas
  queueLimit: 0               // sin límite de cola
});

module.exports = pool;
