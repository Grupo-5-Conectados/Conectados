// src/pages/RegisterPage.jsx

import React, { useState } from 'react';
import '../styles/register_page.scss';
import { useNavigate } from 'react-router-dom';
import { register } from '../utils/api';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: '' // 'cliente' o 'profesional'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (!formData.userType) {
      alert('Debes seleccionar un tipo de perfil');
      return;
    }

    // Mapear userType a rol de la API
    const rol = formData.userType === 'profesional' ? 'prestador' : 'usuario';

    try {
      await register({
        nombre: formData.name,
        correo: formData.email,
        password: formData.password,
        rol
      });
      alert('Registro exitoso. Por favor inicia sesión.');
      navigate('/login');
    } catch (err) {
      alert(
        'Error al registrar: ' +
        (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <div className="register-page">
      <div className="form-container">
        <h1>Crear Cuenta</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          <div className="input-group">
            <input
              type="tel"
              placeholder="Número de teléfono (opcional)"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              required
            />
          </div>

          <div className="input-group user-type-options">
            <label>
              <input
                type="radio"
                name="userType"
                value="cliente"
                checked={formData.userType === 'cliente'}
                onChange={(e) =>
                  setFormData({ ...formData, userType: e.target.value })
                }
              />
              Consumidor
            </label>
            <label>
              <input
                type="radio"
                name="userType"
                value="profesional"
                checked={formData.userType === 'profesional'}
                onChange={(e) =>
                  setFormData({ ...formData, userType: e.target.value })
                }
              />
              Proveedor de servicios
            </label>
          </div>

          <div className="submit-group">
            <button type="submit">Registrarse</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
