const express = require('express');
const cors = require('cors');
require('dotenv').config(); // para poder usar .env

const app = express();

app.use(cors()); // Permite que el frontend se conecte
app.use(express.json()); // Para leer JSON en el body

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API Conectados funcionando 👋");
});

module.exports = app;
