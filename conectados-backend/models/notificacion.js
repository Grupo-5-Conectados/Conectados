'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Notificacion extends Model {}

  Notificacion.init({
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
    tipo: {
      type: DataTypes.STRING(50), // 'mensaje' o 'reserva'
      allowNull: false
    },
    mensaje: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    leido: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Notificacion',
    tableName: 'notificaciones',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  Notificacion.associate = (models) => {
    Notificacion.belongsTo(models.Usuario, {
      foreignKey: 'usuarioId',
      as: 'usuario'
    });
  };

  return Notificacion;
};
