import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../styles/navbar.scss';

const Navbar = () => {
  const userRole = localStorage.getItem('userRole');
  const navigate = useNavigate();
  const location = useLocation(); // Obtenemos la ruta actual

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  // Verificamos si estamos en la página de login o registro para no mostrar los botones correspondientes
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        Conectados
      </Link>
      <ul className="navbar__links">
        <li>
          <Link to="/" className="navbar__link">Inicio</Link>
        </li>
        {/* El botón de Explorar ha sido eliminado */}
        <li>
          <Link to="/servicios" className="navbar__link">Servicios</Link>
        </li>

        {/* Condicional para no mostrar los botones de login/registro en las páginas correspondientes */}
        {!userRole && !isAuthPage && (
          <>
            <li><Link to="/register" className="navbar__link">Registrarse</Link></li>
            <li><Link to="/login" className="navbar__link">Iniciar sesión</Link></li>
          </>
        )}

        {userRole === 'admin' && (
          <>
            <li><Link to="/gestion-usuarios" className="navbar__link">Gestionar Usuarios</Link></li>
            <li><Link to="/denuncias" className="navbar__link">Denuncias</Link></li>
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
