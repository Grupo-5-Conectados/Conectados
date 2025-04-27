import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Aquí iría la lógica de autenticación, probablemente una llamada a un backend
    const response = await api.login({ email, password });
    
    // Si la autenticación es exitosa, obtenemos el rol
    if (response.success) {
      const userRole = response.data.userRole; // 'admin', 'profesional', 'cliente'
      
      // Guardamos el rol del usuario en localStorage
      localStorage.setItem('userRole', userRole);
      
      // Redirigimos según el rol (opcional)
      if (userRole === 'admin') {
        navigate('/panel-admin');
      } else if (userRole === 'profesional') {
        navigate('/agenda');
      } else if (userRole === 'cliente') {
        navigate('/servicios');
      }
    } else {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Iniciar sesión</button>
    </form>
  );
};

export default LoginPage;
