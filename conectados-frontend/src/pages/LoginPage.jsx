import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar'; // Asegúrate de importar la Navbar
import '../styles/login_page.scss';

const LoginPage = () => {
  const [formData, setFormData] = useState({ correo: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const resp = await login({ correo: formData.correo, password: formData.password });
      const token = resp.data.data.token;
      localStorage.setItem('token', token);
      const { rol } = jwtDecode(token);
      localStorage.setItem('userRole', rol);
      if (rol === 'admin')       navigate('/panel-admin');
      else if (rol === 'prestador') navigate('/crear');
      else                          navigate('/servicios');
    } catch {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div>
      <Navbar /> {/* Aquí agregas la Navbar para que siempre esté visible */}
      <div className="login-page">
        <div className="login-card">
          <h2>Iniciar Sesión</h2>
          {error && <div className="alert alert--error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label>Correo electrónico</label>
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
            <button type="submit" className="btn">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
