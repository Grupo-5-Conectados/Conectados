// models/booking.js

'use strict';
/**
 * Modelo Booking:
 * Representa una reserva de un servicio por parte de un usuario.
 * - Campos en BD: id, usuarioId, servicioId, fecha_hora, estado.
 * - Índice único para evitar doble reserva confirmada.
 */
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Booking extends Model {}

  Booking.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    usuarioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'usuario_id',
      validate: {
        isInt: { msg: 'usuarioId debe ser un entero.' }
      }
    },
    servicioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'servicio_id',
      validate: {
        isInt: { msg: 'servicioId debe ser un entero.' }
      }
    },
    fecha_hora: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isDate: { msg: 'fecha_hora debe ser un formato de fecha válido.' },
        notEmpty: { msg: 'fecha_hora es obligatorio.' }
      }
    },
    estado: {
      type: DataTypes.ENUM('pendiente','confirmada','cancelada','realizada'),
      allowNull: false,
      defaultValue: 'pendiente',
      validate: {
        isIn: {
          args: [['pendiente','confirmada','cancelada','realizada']],
          msg: 'Estado inválido.'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['servicio_id', 'fecha_hora', 'estado'],
        where: { estado: 'confirmada' }
      }
    ]
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.Usuario,  { foreignKey: 'usuarioId',  as: 'usuario' });
    Booking.belongsTo(models.Servicio, { foreignKey: 'servicioId', as: 'servicio' });
  };

  return Booking;
};
