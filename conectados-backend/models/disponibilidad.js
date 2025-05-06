// models/disponibilidad.js

'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Disponibilidad extends Model {}

  Disponibilidad.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    prestadorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'prestador_id'
    },
    servicioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'servicio_id'
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false
    },
    disponible: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Disponibilidad',
    tableName: 'disponibilidades',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Disponibilidad.associate = (models) => {
    // Cada slot pertenece a un Servicio
    Disponibilidad.belongsTo(models.Servicio, {
      foreignKey: 'servicioId',
      as: 'servicio'
    });
    // Cada slot también sabe su prestador
    Disponibilidad.belongsTo(models.Usuario, {
      foreignKey: 'prestadorId',
      as: 'prestador'
    });
  };

  return Disponibilidad;
};
