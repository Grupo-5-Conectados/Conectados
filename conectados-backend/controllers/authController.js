const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

exports.register = async (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  // Validamos que rol sea uno de los permitidos
  const rolesPermitidos = ['usuario','prestador'];
  if (!nombre || !correo || !password || !rol || !rolesPermitidos.includes(rol)) {
    return res.status(400).json({ error: 'Faltan campos obligatorios o rol inválido.' });
  }

  try {
    const existente = await Usuario.findOne({ where: { correo } });
    if (existente) {
      return res.status(409).json({ error: 'Correo ya registrado.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const nuevo = await Usuario.create({
      nombre,
      correo,
      password: hash,
      rol               // guardamos el rol que envía el frontend
    });
    return res.status(201).json({
      message: 'Usuario creado',
      userId: nuevo.id
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al registrar usuario.' });
  }
};

exports.login = async (req, res) => {
  const { correo, password } = req.body;
  if (!correo || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios.' });
  }

  try {
    const user = await Usuario.findOne({ where: { correo } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const payload = { id: user.id, correo: user.correo, rol: user.rol };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
    return res.json({ token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
};
