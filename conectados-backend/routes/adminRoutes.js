const express = require('express');
const router = express.Router();

// Ejemplo de ruta temporal
router.get('/', (req, res) => {
  res.send('Ruta funcionando');
});

module.exports = router;
