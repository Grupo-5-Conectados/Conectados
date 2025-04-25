const app = require('./app'); // Importa lo que escribimos en app.js

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});
