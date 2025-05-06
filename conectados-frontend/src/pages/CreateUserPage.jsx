// src/pages/CreateUserPage.jsx
import React, { useState } from 'react';
import { createUser } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; 
import '../styles/CreateUserPage.scss';

const CreateUserPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    password: '',
    rol: 'usuario'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.nombre || !formData.correo || !formData.password) {
      setError('Completa todos los campos obligatorios');
      return;
    }

    try {
      await createUser({
        nombre: formData.nombre,
        correo: formData.correo,
        contraseña: formData.password,
        rol: formData.rol
      });
      setSuccess('Usuario creado correctamente');
      setTimeout(() => navigate('/gestion-usuarios'), 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear usuario');
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-user-page">
        <h2>Crear Nuevo Usuario</h2>
        {error && <div className="alert alert--error">{error}</div>}
        {success && <div className="alert alert--success">{success}</div>}

        <form onSubmit={handleSubmit} className="create-user-form">
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

          <label>Contraseña</label>
          <input
            type="password"
            value={formData.password}
            onChange={e => handleChange('password', e.target.value)}
            required
          />

          <label>Rol</label>
          <select
            value={formData.rol}
            onChange={e => handleChange('rol', e.target.value)}
          >
            <option value="usuario">Usuario</option>
            <option value="prestador">Prestador</option>
            <option value="admin">Admin</option>
          </select>

          <button type="submit" className="btn">Crear Usuario</button>
        </form>
      </div>
    </>
  );
};

export default CreateUserPage;
