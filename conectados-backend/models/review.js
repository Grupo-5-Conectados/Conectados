// models/review.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Review extends Model {}

  Review.init({
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
    puntuacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Review',
    tableName: 'reviews',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      {
        unique: true,
        fields: ['usuario_id', 'servicio_id']
      }
    ]
  });

  Review.associate = (models) => {
    Review.belongsTo(models.Usuario, { foreignKey: 'usuarioId', as: 'usuario' });
    Review.belongsTo(models.Servicio, { foreignKey: 'servicioId', as: 'servicio' });
  };

  return Review;
};
