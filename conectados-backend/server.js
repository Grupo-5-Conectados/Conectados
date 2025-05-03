// server.js
require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 4000;

// Sincronizar modelos y arrancar servidor
(async () => {
  try {
    await sequelize.authenticate();
    console.log('🔗 Conexión a la BD establecida correctamente.');
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas en la BD');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Error al iniciar la BD o servidor:', err);
    process.exit(1);
  }
})();
