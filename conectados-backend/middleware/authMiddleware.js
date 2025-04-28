const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

async function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Falta token' });

  const [scheme, token] = authHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Token malformado' });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    // Opcional: recuperar datos del usuario si los necesitas
    const user = await Usuario.findByPk(payload.id);
    if (!user) return res.status(401).json({ error: 'Usuario no existe' });
    req.user = user;  // lo dejamos disponible en req.user
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = { verifyToken };
