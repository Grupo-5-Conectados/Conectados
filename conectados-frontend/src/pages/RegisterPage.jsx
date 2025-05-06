import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../utils/api';
import Navbar from '../components/Navbar'; // Importar Navbar
import '../styles/register_page.scss';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: ''
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (!formData.userType) {
      setError('Selecciona un tipo de perfil');
      return;
    }

    const rol = formData.userType === 'profesional' ? 'prestador' : 'usuario';

    try {
      await register({
        nombre:   formData.name,
        correo:   formData.email,
        password: formData.password,
        rol
      });
      setSuccess('Registro exitoso. Redirigiendo al login…');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al registrar';
      setError(msg);
    }
  };

  return (
    <div>
      <Navbar /> {/* Aquí se agrega la Navbar en la página de registro */}

      <div className="register-page">
        <div className="register-card">
          <h2>Crear Cuenta</h2>

          {error &&   <div className="alert alert--error">{error}</div>}
          {success && <div className="alert alert--success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <label>Nombre completo</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={e => handleChange('email', e.target.value)}
              required
            />

            <label>Contraseña</label>
            <input
              type="password"
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              required
            />

            <label>Confirmar contraseña</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              required
            />

            <div className="user-type">
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="cliente"
                  checked={formData.userType === 'cliente'}
                  onChange={e => handleChange('userType', e.target.value)}
                />
                Cliente
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="profesional"
                  checked={formData.userType === 'profesional'}
                  onChange={e => handleChange('userType', e.target.value)}
                />
                Profesional
              </label>
            </div>

            <button type="submit" className="btn">Registrarse</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
