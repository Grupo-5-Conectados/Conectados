'use strict';
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
      field: 'usuario_id'
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
    estado: {
      type: DataTypes.ENUM('pendiente','confirmada','cancelada'),
      allowNull: false,
      defaultValue: 'pendiente'
    }
  }, {
    sequelize,
    modelName: 'Booking',
    tableName: 'bookings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Booking.associate = (models) => {
    Booking.belongsTo(models.Usuario,   { foreignKey: 'usuarioId',  as: 'usuario' });
    Booking.belongsTo(models.Servicio,  { foreignKey: 'servicioId', as: 'servicio' });
  };

  return Booking;
};
