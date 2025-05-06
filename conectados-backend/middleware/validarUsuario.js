const validarUsuario = (req, res, next) => {
    const { nombre, correo, password } = req.body;
  
    if (!nombre || typeof nombre !== 'string') {
      return res.status(400).json({ error: 'El nombre es obligatorio y debe ser un texto.' });
    }
  
    if (!correo || !correo.includes('@')) {
      return res.status(400).json({ error: 'El correo es obligatorio y debe ser válido.' });
    }
  
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'La contraseña es obligatoria y debe tener al menos 6 caracteres.' });
    }
  
    next(); // Si todo está bien, pasa al siguiente middleware o controlador
  };
  
  module.exports = validarUsuario;