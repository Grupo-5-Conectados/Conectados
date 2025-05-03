// src/pages/CreateServicePage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createService } from '../utils/api';
import '../styles/CreateServicePage.scss';

const CreateServicePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    categoria: '',
    zona: '',
    duracion: ''
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'prestador' && role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    // Validaciones básicas
    if (
      !formData.titulo ||
      !formData.descripcion ||
      !formData.precio ||
      !formData.categoria ||
      !formData.zona
    ) {
      setError('Completa todos los campos obligatorios');
      return;
    }

    try {
      await createService({
        titulo:      formData.titulo,
        descripcion: formData.descripcion,
        precio:      parseFloat(formData.precio),
        categoria:   formData.categoria,
        zona:        formData.zona,
        duracion:    formData.duracion ? parseInt(formData.duracion, 10) : null
      });
      setSuccess('Servicio publicado correctamente');
      setTimeout(() => navigate('/servicios'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al publicar servicio');
    }
  };

  return (
    <div className="create-service-page">
      <div className="service-card">
        <h2>Publicar Servicio</h2>

        {error   && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <label>Título</label>
          <input
            type="text"
            value={formData.titulo}
            onChange={e => handleChange('titulo', e.target.value)}
            required
          />

          <label>Descripción</label>
          <textarea
            value={formData.descripcion}
            onChange={e => handleChange('descripcion', e.target.value)}
            required
          />

          <label>Precio</label>
          <input
            type="number"
            value={formData.precio}
            onChange={e => handleChange('precio', e.target.value)}
            required
          />

          <label>Categoría</label>
          <input
            type="text"
            value={formData.categoria}
            onChange={e => handleChange('categoria', e.target.value)}
            required
          />

          <label>Zona</label>
          <input
            type="text"
            value={formData.zona}
            onChange={e => handleChange('zona', e.target.value)}
            required
          />

          <label>Duración (horas)</label>
          <input
            type="number"
            value={formData.duracion}
            onChange={e => handleChange('duracion', e.target.value)}
          />

          <button type="submit" className="btn">Publicar</button>
        </form>
      </div>
    </div>
  );
};

export default CreateServicePage;
