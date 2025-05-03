// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, allowedRoles }) => {
  const token    = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  // Si no hay token, redirige a login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // Si el rol no está permitido, redirige a home
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  // Si todo OK, renderiza el componente
  return element;
};

export default PrivateRoute;
