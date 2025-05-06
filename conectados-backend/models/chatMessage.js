// src/models/chatMessage.js
'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ChatMessage extends Model {}

  ChatMessage.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    servicioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'servicio_id'
    },
    fromUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'from_user_id'
    },
    toUserId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      field: 'to_user_id'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ChatMessage',
    tableName: 'chat_messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  ChatMessage.associate = (models) => {
    ChatMessage.belongsTo(models.Servicio, { foreignKey: 'servicioId', as: 'servicio' });
    ChatMessage.belongsTo(models.Usuario,  { foreignKey: 'fromUserId', as: 'fromUser' });
    ChatMessage.belongsTo(models.Usuario,  { foreignKey: 'toUserId',   as: 'toUser' });
  };

  return ChatMessage;
};
