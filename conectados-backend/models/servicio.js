// models/servicio.js

'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Servicio extends Model {}

  Servicio.init({
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
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    categoria: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    zona: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    duracion: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'duracion_estimada'
    },
    imagenUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'imagen_url'
    }
  }, {
    sequelize,
    modelName: 'Servicio',
    tableName: 'servicios',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Servicio.associate = (models) => {
    // Relación con Usuario (prestador)
    Servicio.belongsTo(models.Usuario, {
      foreignKey: 'prestadorId',
      as: 'prestador'
    });
    // **Aquí** agregamos la relación con Disponibilidad:
    Servicio.hasMany(models.Disponibilidad, {
      foreignKey: 'servicioId',
      as: 'disponibilidades'
    });
    // Y mantenemos la relación con Booking si existe:
    Servicio.hasMany(models.Booking, {
      foreignKey: 'servicioId',
      as: 'bookings'
    });
  };

  return Servicio;
};
