// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import '../styles/AdminPanel.scss';
import { getUsers } from '../utils/api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getUsers()
      .then(res => setUsers(res.data.data || res.data))
      .catch(err => setError(err.response?.data?.message || 'Error cargando usuarios'));
  }, []);

  return (
    <div className="admin-panel">
      <h2>Panel de Administración</h2>
      {error && <div className="alert alert--error">{error}</div>}
      <table className="admin-panel__table">
        <thead>
          <tr>
            <th>ID</th><th>Nombre</th><th>Correo</th><th>Rol</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td>
                <button className="btn btn--small">Editar</button>
                <button className="btn btn--small btn--danger">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
