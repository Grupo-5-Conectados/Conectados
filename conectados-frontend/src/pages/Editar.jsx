// src/pages/Editar.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceById, updateService, deleteService } from '../utils/api';
import '../styles/Editar.scss';

const Editar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '', descripcion: '', precio: '', categoria: '', zona: '', duracion: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    getServiceById(id)
      .then(res => {
        const s = res.data.data || res.data;
        setFormData({
          titulo: s.titulo,
          descripcion: s.descripcion,
          precio: s.precio,
          categoria: s.categoria,
          zona: s.zona,
          duracion: s.duracion || ''
        });
      })
      .catch(() => setError('Error cargando servicio'));
  }, [id]);

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await updateService(id, {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        categoria: formData.categoria,
        zona: formData.zona,
        duracion: formData.duracion ? parseInt(formData.duracion, 10) : null
      });
      setSuccess('Servicio actualizado correctamente');
      setTimeout(() => navigate('/servicios'), 1500);
    } catch {
      setError('Error al actualizar servicio');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('¿Estás seguro de que quieres eliminar este servicio? Esta acción no se puede deshacer.');
    if (confirmed) {
      try {
        await deleteService(id);
        alert('Servicio eliminado correctamente');
        navigate('/servicios');
      } catch (err){
        console.error('Error al eliminar el servicio:',err ); // 👈 esto te da más información
        setError('Error al eliminar el servicio');
      }
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-card">
        <h2>Editar Servicio</h2>
        {error && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success">{success}</div>}
        <form onSubmit={handleSubmit}>
          <label>Título</label>
          <input type="text" value={formData.titulo} onChange={e => handleChange('titulo', e.target.value)} required />

          <label>Descripción</label>
          <textarea value={formData.descripcion} onChange={e => handleChange('descripcion', e.target.value)} required />

          <label>Precio</label>
          <input type="number" value={formData.precio} onChange={e => handleChange('precio', e.target.value)} required />

          <label>Categoría</label>
          <input type="text" value={formData.categoria} onChange={e => handleChange('categoria', e.target.value)} required />

          <label>Zona</label>
          <input type="text" value={formData.zona} onChange={e => handleChange('zona', e.target.value)} required />

          <label>Duración (horas)</label>
          <input type="number" value={formData.duracion} onChange={e => handleChange('duracion', e.target.value)} />

          <button type="submit" className="btn">Guardar Cambios</button>
          <button onClick={handleDelete} className="btn btn--danger">
          Eliminar Servicio
        </button>
        </form>

        <hr />

      </div>
    </div>
  );
};

export default Editar;
