// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { getMe } from '../utils/api';  // Cambiado de getUserById a getMe
import Navbar from '../components/Navbar';
import '../styles/ProfilePage.scss';
import Footer from '../components/Footer';

const ProfilePage = () => {
  const [user, setUser] = useState({ nombre: '', correo: '', rol: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    getMe()
      .then(res => {
        const u = res.data.data || res.data;
        setUser({ nombre: u.nombre, correo: u.correo, rol: u.rol });
      })
      .catch(() => setError('Error cargando perfil'));
  }, []);

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="Title">
        <h2>Mi Perfil</h2>
        </div>
        <div className="Body"> 
        {error && <div className="alert alert--error">{error}</div>}
        <div className="profile-info">
          <p><strong>Nombre:</strong> {user.nombre}</p>
          <p><strong>Correo:</strong> {user.correo}</p>
          <p><strong>Rol:</strong> {user.rol}</p>
        </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ProfilePage;
