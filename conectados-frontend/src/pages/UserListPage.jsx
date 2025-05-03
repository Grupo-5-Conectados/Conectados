// src/pages/UserListPage.jsx
import React, { useEffect, useState } from 'react';
import { getUsers, deleteUser } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import '../styles/UserListPage.scss';

const UserListPage = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getUsers()
      .then(res => setUsers(res.data.data || res.data))
      .catch(err => setError(err.response?.data?.message || 'Error cargando usuarios'));
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar usuario?')) return;
    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar usuario');
    }
  };

  return (
    <div className="user-list-page">
      <h2>Gestión de Usuarios</h2>
      {error && <div className="alert alert--error">{error}</div>}
      <button onClick={() => navigate('/crear-usuario')} className="btn">
        Crear Usuario
      </button>
      <table className="user-list-table">
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
                <button
                  onClick={() => navigate(`/editar-usuario/${u.id}`)}
                  className="btn btn--small"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="btn btn--small btn--danger"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListPage;
