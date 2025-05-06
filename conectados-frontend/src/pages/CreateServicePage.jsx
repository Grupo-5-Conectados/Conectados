// src/pages/CreateServicePage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createService, createDisponibilidad } from '../utils/api';
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
  const [slotDate, setSlotDate] = useState('');
  const [newSlots, setNewSlots] = useState([]);
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

  const handleAddSlot = () => {
    if (!slotDate) return;
    setNewSlots(prev => [...prev, slotDate]);
    setSlotDate('');
  };

  const handleRemoveSlot = idx => {
    setNewSlots(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');

    const { titulo, descripcion, precio, categoria, zona, duracion } = formData;
    if (!titulo || !descripcion || !precio || !categoria || !zona) {
      setError('Completa todos los campos obligatorios');
      return;
    }
    if (newSlots.length === 0) {
      setError('Agrega al menos un horario disponible');
      return;
    }

    try {
      // 1) Crear servicio
      const res = await createService({
        titulo,
        descripcion,
        precio: parseFloat(precio),
        categoria,
        zona,
        duracion: duracion ? parseInt(duracion, 10) : null
      });
      const serviceId = res.data.data.id || res.data.id;

      // 2) Crear slots de disponibilidad uno a uno
      await Promise.all(newSlots.map(fecha_hora =>
        createDisponibilidad(serviceId, { fecha_hora: new Date(fecha_hora).toISOString() })
      ));

      setSuccess('Servicio y horarios publicados correctamente');
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

          <fieldset className="slots-fieldset">
            <legend>Horarios Disponibles</legend>
            <input
              type="datetime-local"
              value={slotDate}
              onChange={e => setSlotDate(e.target.value)}
            />
            <button type="button" className="btn btn--small" onClick={handleAddSlot}>
              Agregar Horario
            </button>
            <ul className="slots-list">
              {newSlots.map((s, idx) => (
                <li key={idx}>
                  {new Date(s).toLocaleString()}{' '}
                  <button type="button" onClick={() => handleRemoveSlot(idx)}>
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </fieldset>

          <button type="submit" className="btn">Publicar</button>
        </form>
      </div>
    </div>
  );
};

export default CreateServicePage;
