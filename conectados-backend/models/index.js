'use strict';
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = 'development';
const config = require(__dirname + '/../config/sequelize.js')[env];

const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);
const Disponibilidad = require('./disponibilidad')(sequelize);
db.Disponibilidad = Disponibilidad;

const chatMessage = require('./chatMessage')(sequelize);
db[chatMessage.name] = chatMessage;

const notificacion = require('./notificacion')(sequelize);
db[notificacion.name] = notificacion;



fs
  .readdirSync(__dirname)
  .filter(file =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js'
  )
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
