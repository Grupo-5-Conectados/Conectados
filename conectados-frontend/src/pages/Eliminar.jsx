// src/pages/Eliminar.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById, deleteService } from '../utils/api';
import '../styles/Eliminar.scss';

const Eliminar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getServiceById(id)
      .then(res => {
        const s = res.data.data || res.data;
        setService(s);
      })
      .catch(() => setError('Error al cargar el servicio'));
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteService(id);
      navigate('/servicios');
    } catch (err) {
      setError('Error al eliminar el servicio');
    }
  };

  if (error) return <div className="alert alert--error">{error}</div>;
  if (!service) return <div>Cargando servicio...</div>;

  return (
    <div className="delete-page">
      <div className="delete-card">
        <h2>¿Estás seguro que deseas eliminar este servicio?</h2>
        <p><strong>Título:</strong> {service.titulo}</p>
        <p><strong>Descripción:</strong> {service.descripcion}</p>
        <div className="delete-actions">
          <button onClick={handleDelete} className="btn btn--danger">Eliminar</button>
          <button onClick={() => navigate('/servicios')} className="btn">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default Eliminar;
