// models/servicio.js

'use strict';
/**
 * Modelo Servicio:
 * Representa un servicio ofrecido por un prestador.
 * - Campos en BD: id, prestadorId, titulo, descripcion, precio, categoria, zona, duracion, imagenUrl.
 * - Validaciones básicas y asociaciones.
 */
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
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El título no puede estar vacío.' },
        len: { args: [5, 150], msg: 'El título debe tener entre 5 y 150 caracteres.' }
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La descripción no puede estar vacía.' }
      }
    },
    precio: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      validate: {
        isDecimal: { msg: 'El precio debe ser un número decimal.' },
        min: { args: [0], msg: 'El precio no puede ser negativo.' }
      }
    },
    categoria: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La categoría es obligatoria.' }
      }
    },
    zona: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'La zona es obligatoria.' }
      }
    },
    duracion: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      field: 'duracion_estimada',
      validate: {
        min: { args: [0], msg: 'La duración no puede ser negativa.' }
      }
    },
    imagenUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'imagen_url',
      validate: {
        isUrl: { msg: 'La imagenUrl debe ser una URL válida.' }
      }
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
    // Cada servicio pertenece a un prestador (Usuario)
    Servicio.belongsTo(models.Usuario, { foreignKey: 'prestadorId', as: 'prestador' });
    // Un servicio puede tener muchas reservas
    Servicio.hasMany(models.Booking,   { foreignKey: 'servicioId', as: 'bookings' });
  };

  return Servicio;
};
