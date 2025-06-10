const db = require('../models');

const getNotificaciones = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const notificaciones = await db.Notificacion.findAll({
      where: { usuarioId },
      order: [['created_at', 'DESC']]
    });
    res.json(notificaciones);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener notificaciones' });
  }
};

const marcarComoLeida = async (req, res) => {
  try {
    const { id } = req.params;
    await db.Notificacion.update({ leido: true }, { where: { id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Error al marcar notificación como leída' });
  }
};

module.exports = {
  getNotificaciones,
  marcarComoLeida
};
