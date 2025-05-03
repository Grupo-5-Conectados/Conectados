// src/pages/UserEditPage.jsx
import React, { useState, useEffect } from 'react';
import { getUserById, updateUser } from '../utils/api';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/UserEditPage.scss';

const UserEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', correo: '', rol: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    getUserById(id)
      .then(res => {
        const u = res.data.data || res.data;
        setFormData({ nombre: u.nombre, correo: u.correo, rol: u.rol });
      })
      .catch(() => setError('Error cargando usuario'));
  }, [id]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await updateUser(id, formData);
      navigate('/gestion-usuarios');
    } catch {
      setError('Error al actualizar usuario');
    }
  };

  return (
    <div className="user-edit-page">
      <h2>Editar Usuario</h2>
      {error && <div className="alert alert--error">{error}</div>}
      <form onSubmit={handleSubmit} className="user-edit-form">
        <label>Nombre</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={e => handleChange('nombre', e.target.value)}
          required
        />

        <label>Correo</label>
        <input
          type="email"
          value={formData.correo}
          onChange={e => handleChange('correo', e.target.value)}
          required
        />

        <label>Rol</label>
        <select
          value={formData.rol}
          onChange={e => handleChange('rol', e.target.value)}
          required
        >
          <option value="usuario">Usuario</option>
          <option value="prestador">Prestador</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit" className="btn">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default UserEditPage;
