import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  // Obtener el rol del usuario desde localStorage
  const userRole = localStorage.getItem('userRole');

  const navbarStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  };

  const logoStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#333',
    textDecoration: 'none',
  };

  const linksStyle = {
    display: 'flex',
    gap: '1.5rem',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: '#555',
    fontSize: '1rem',
    fontWeight: '500',
  };

  return (
    <nav style={navbarStyle}>
      <Link to="/" style={logoStyle}>
        Conectados
      </Link>
      <div style={linksStyle}>
        <Link to="/" style={linkStyle}>Inicio</Link>
        <Link to="/explorar" style={linkStyle}>Explorar</Link>
        <Link to="/servicios" style={linkStyle}>Servicios</Link>
        
        {/* Mostrar diferentes enlaces según el rol del usuario */}
        {userRole === 'admin' && (
          <>
            <Link to="/gestion-usuarios" style={linkStyle}>Gestionar Usuarios</Link>
            <Link to="/denuncias" style={linkStyle}>Gestionar Denuncias</Link>
            <Link to="/panel-admin" style={linkStyle}>Panel Admin</Link>
          </>
        )}
        
        {userRole === 'profesional' && (
          <>
            <Link to="/agenda" style={linkStyle}>Mi Agenda</Link>
            <Link to="/publicar-servicio" style={linkStyle}>Publicar Servicio</Link>
            <Link to="/mensajes" style={linkStyle}>Mensajes</Link>
            <Link to="/perfil" style={linkStyle}>Mi Perfil</Link>
          </>
        )}

        {userRole === 'cliente' && (
          <>
            <Link to="/buscar-servicios" style={linkStyle}>Buscar Servicios</Link>
            <Link to="/mis-citas" style={linkStyle}>Mis Citas</Link>
            <Link to="/mensajes" style={linkStyle}>Mensajes</Link>
          </>
        )}

        {!userRole && (
          <>
            <Link to="/register" style={linkStyle}>Registrarse</Link>
            <Link to="/login" style={linkStyle}>Iniciar sesión</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
