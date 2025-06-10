// src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { getMe, getMyReviews } from '../utils/api';

import Navbar from '../components/Navbar';
import '../styles/ProfilePage.scss';
import Footer from '../components/Footer';

const ProfilePage = () => {
  const [user, setUser] = useState({ nombre: '', correo: '', rol: '' });
  const [error, setError] = useState('');
  const [reviews, setReviews] = useState([]);
  const [promedio, setPromedio] = useState(null);

  useEffect(() => {
    getMe()
      .then(res => {
        const u = res.data.data || res.data;
        setUser({ nombre: u.nombre, correo: u.correo, rol: u.rol });

        if (u.rol === 'prestador') {
          getMyReviews()
            .then(res => {
              const datos = res.data.data;
              setReviews(datos.reviews);
              setPromedio(datos.promedio);
            })
            .catch(() => setError('Error cargando reviews'));
        }
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

          {user.rol === 'prestador' && (
            <div className="reviews-section">
              <h3>Reseñas Recibidas</h3>
              {promedio && <p><strong>Promedio:</strong> ⭐ {promedio}</p>}
              {reviews.length === 0 ? (
                <p>No tienes reseñas aún.</p>
              ) : (
                <ul>
                  {reviews.map((r, i) => (
                    <li key={i}>
                      <strong>{r.servicio?.titulo || 'Servicio desconocido'}</strong> – ⭐ {r.puntuacion}<br />
                      <em>{r.comentario}</em>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default ProfilePage;
