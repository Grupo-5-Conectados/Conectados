// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, allowedRoles }) => {
  const userRole = localStorage.getItem('userRole');
  
  // Si no hay usuario o el rol no está permitido, redirige al login
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" />;
  }

  return element; // Si el usuario tiene el rol permitido, muestra el componente
};

export default PrivateRoute;
