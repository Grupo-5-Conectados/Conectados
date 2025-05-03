// controllers/authControllers.js

'use strict';
/**
 * Controlador de autenticación: registro e inicio de sesión de usuarios.
 */
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '12h';

// Registro de nuevo usuario
exports.register = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  const rolesPermitidos = ['usuario', 'prestador', 'admin'];
  if (!nombre || !correo || !password || !rol || !rolesPermitidos.includes(rol)) {
    return res.status(400).json({ code: 400, message: 'Faltan campos obligatorios o rol inválido.' });
  }

  try {
    const existente = await Usuario.findOne({ where: { correo } });
    if (existente) {
      return res.status(409).json({ code: 409, message: 'Correo ya registrado.' });
    }

    // El hook antes de crear hashea la contraseña automáticamente
    const nuevo = await Usuario.create({ nombre, correo, password, rol });
    return res.status(201).json({
      code: 201,
      message: 'Usuario creado.',
      data: { id: nuevo.id, nombre: nuevo.nombre, correo: nuevo.correo, rol: nuevo.rol }
    });
  } catch (error) {
    console.error('Error en register:', error);
    return res.status(500).json({ code: 500, message: 'Error al registrar usuario.', details: error.message });
  }
};

// Inicio de sesión
exports.login = async (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ code: 400, message: 'Faltan campos obligatorios.' });
  }

  try {
    const user = await Usuario.findOne({ where: { correo } });
    if (!user) {
      return res.status(401).json({ code: 401, message: 'Credenciales inválidas.' });
    }

    // Método de instancia definido en el modelo Usuario
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      return res.status(401).json({ code: 401, message: 'Credenciales inválidas.' });
    }

    const payload = { id: user.id, correo: user.correo, rol: user.rol };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
    return res.status(200).json({ code: 200, message: 'Login exitoso.', data: { token } });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ code: 500, message: 'Error al iniciar sesión.', details: error.message });
  }
};
