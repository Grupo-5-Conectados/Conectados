// src/pages/ServiceListPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices } from '../utils/api';
import '../styles/ServiceListPage.scss';

const ServiceListPage = () => {
  const [services, setServices] = useState([]);
  const [error, setError]       = useState('');
  const userRole                = localStorage.getItem('userRole');

  useEffect(() => {
    getServices()
      .then(res => setServices(res.data.data || res.data))
      .catch(err => setError(err.response?.data?.message || 'Error al cargar servicios'));
  }, []);

  return (
    <div className="service-list-page">
      <h2>Servicios Disponibles</h2>
      {error && <div className="alert alert--error">{error}</div>}
      <div className="service-grid">
        {services.map(s => (
          <div key={s.id} className="service-card">
            <h3>{s.titulo}</h3>
            <p>{s.descripcion.slice(0, 100)}...</p>
            <p><strong>Precio:</strong> ${s.precio}</p>
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
)};

export default ServiceListPage;
