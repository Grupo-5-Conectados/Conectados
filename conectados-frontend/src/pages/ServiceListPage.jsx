import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ServiceListPage.scss';

const ServiceListPage = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState('');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    getServices()
      .then(res => setServices(res.data.data || res.data))
      .catch(err => setError(err.response?.data?.message || 'Error al cargar servicios'));
  }, []);

  const getTitle = () => {
    return userRole === 'prestador' ? 'Servicios Publicados' : 'Servicios Disponibles';
  };

  return (
    <div className="service-list-page">
      <Navbar />
      <div className="Title">
        <h2>{getTitle()}</h2>
        {error && <div className="alert alert--error">{error}</div>}
      </div>
      
      <div className="Body">
        <div className="service-grid">
          {services.map(s => (
            <div key={s.id} className="service-card">
              <h3>{s.titulo}</h3>
              <p>{s.descripcion.slice(0, 100)}...</p>
              <p><strong>Precio:</strong> ${s.precio}</p>

              <p><strong>Prestador:</strong> {s.prestador?.nombre || 'No disponible'}</p>

              {s.prestador?.rating_promedio_global ? (
              <p>
                <strong>⭐ Evaluación:</strong>{' '}
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    style={{ color: i < Math.round(s.prestador.rating_promedio_global) ? '#FFD700' : '#ccc' }}
                  >
                    ★
                  </span>
                ))}{' '}
                ({s.prestador.rating_promedio_global}/5)
              </p>
            ) : (
              <p><strong>⭐ Evaluación:</strong> Aún sin calificaciones</p>
            )}



              <Link to={`/servicios/${s.id}`} className="btn">Ver detalle</Link>
              {(userRole === 'prestador' || userRole === 'admin') && (
                <Link to={`/editar/${s.id}`} className="btn btn--secondary">
                  Editar
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceListPage;
