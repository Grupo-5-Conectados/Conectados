import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/navbar.scss';

const Navbar = () => {
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);

  const marcarComoLeida = async (id) => {
    try {
      const token = localStorage.getItem('token');

      // Llama a la API que ya creaste en el backend (PUT /api/notificaciones/:id/leida)
      await axios.put(`http://localhost:4000/api/notificaciones/${id}/leida`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Actualiza el estado local quitando esa notificación
      setNotificaciones(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error('Error al marcar como leída:', err);
    }
  };

  useEffect(() => {
  const fetchNotificaciones = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId'); // Asegúrate de guardar esto al loguear
      if (!userId || !token) return;

      const res = await axios.get(`http://localhost:4000/api/notificaciones/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Solo muestra las no leídas
      setNotificaciones(res.data.filter(n => !n.leido));
    } catch (err) {
      console.error('Error al obtener notificaciones:', err);
    }
  };
  
  fetchNotificaciones();
}, []);


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        Conectados
      </Link>

      <button className="navbar__toggle" onClick={toggleMenu}>
        ☰
      </button>

      <ul className={`navbar__links ${isMenuOpen ? 'navbar__links--open' : ''}`}>
        <li><Link to="/" className="navbar__link">Inicio</Link></li>
        <li><Link to="/servicios" className="navbar__link">Servicios</Link></li>

        {!userRole && !isAuthPage && (
          <>
            <li><Link to="/register" className="navbar__link">Registrarse</Link></li>
            <li><Link to="/login" className="navbar__link">Iniciar sesión</Link></li>
          </>
        )}

        {userRole === 'admin' && (
          <>
            <li><Link to="/gestion-usuarios" className="navbar__link">Gestionar Usuarios</Link></li>
            <li><Link to="/panel-admin" className="navbar__link">Panel Admin</Link></li>
          </>
        )}

        {userRole === 'prestador' && (
          <>
            <li><Link to="/agenda" className="navbar__link">Mi Agenda</Link></li>
            <li><Link to="/crear" className="navbar__link">Publicar Servicio</Link></li>
            <li><Link to="/mensajes" className="navbar__link">Mensajes</Link></li>
            <li><Link to="/perfil" className="navbar__link">Mi Perfil</Link></li>
          </>
        )}

        {userRole === 'usuario' && (
          <>
            <li><Link to="/buscar-servicios" className="navbar__link">Buscar Servicios</Link></li>
            <li><Link to="/mis-citas" className="navbar__link">Mis Citas</Link></li>
            <li><Link to="/mensajes" className="navbar__link">Mensajes</Link></li>
            <li><Link to="/perfil" className="navbar__link">Mi Perfil</Link></li>
          </>
        )}

        {userRole && (
          <li className="navbar__notificaciones">
            <button onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}>
              🔔
              {notificaciones.length > 0 && (
                <span className="navbar__badge">{notificaciones.length}</span>
              )}
            </button>
            {mostrarNotificaciones && (
              <ul className="navbar__dropdown">
                {notificaciones.length === 0 ? (
                  <li>No hay notificaciones</li>
                ) : (
                  notificaciones.map((n) => (
                    <li
                      key={n.id}
                      onClick={() => marcarComoLeida(n.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {n.mensaje}
                    </li>
                  ))

                )}
              </ul>
            )}
          </li>
        )}

        {userRole && (
          <li>
            <button onClick={handleLogout} className="navbar__logout">
              Cerrar sesión
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
