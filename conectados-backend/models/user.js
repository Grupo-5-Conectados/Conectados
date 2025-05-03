// models/usuario.js

'use strict';
/**
 * Modelo Usuario:
 * Representa a un usuario o prestador de servicios.
 * - Campos en BD: id, nombre, correo, password, rol, fecha_registro.
 * - Hooks para hashear la contraseña automáticamente.
 */
const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = (sequelize) => {
  class Usuario extends Model {
    // Método de instancia para verificar password
    async validatePassword(plain) {
      return bcrypt.compare(plain, this.password);
    }
  }

  Usuario.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: { msg: 'El nombre no puede estar vacío.' }
      }
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: 'Debe ser un correo válido.' }
      }
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      // Nota: en la BD la columna también se llamará 'password' para evitar confusiones.
    },
    rol: {
      type: DataTypes.ENUM('usuario','prestador','admin'),
      allowNull: false,
      defaultValue: 'usuario'
    },
    fecha_registro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    tableName: 'usuarios',
    timestamps: false,

    // Hooks para centralizar el hasheo de la contraseña
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      }
    }
  });

  return Usuario;
};
