// Carga variables de entorno
require('dotenv').config();

const mysql = require('mysql2/promise');

// DEBUG: imprime en consola qué está recibiendo
console.log("⛔️ DEBUG DB_USER:", process.env.DB_USER);
console.log("⛔️ DEBUG DB_PASSWORD:", process.env.DB_PASSWORD ? "*****" : "(vacío)");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,       
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool;
