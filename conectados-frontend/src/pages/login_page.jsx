import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/api';
import { jwtDecode } from 'jwt-decode'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async e => {
    e.preventDefault();
    try {
      const response = await login({ correo: email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);

      const { rol } = jwtDecode(token);
      localStorage.setItem('userRole', rol);

      // Redirigir según rol:
      if (rol === 'admin') navigate('/panel-admin');
      else if (rol === 'profesional') navigate('/crear');
      else navigate('/servicios');
    } catch (err) {
      alert('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-page">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default LoginPage;
