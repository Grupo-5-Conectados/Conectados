// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import '../styles/AdminPanel.scss';
import { getUsers } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { deleteUser } from '../utils/api';
import Navbar from '../components/Navbar'; // Asegúrate de que esta ruta sea correcta

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getUsers()
      .then(res => setUsers(res.data.data || res.data))
      .catch(err => setError(err.response?.data?.message || 'Error cargando usuarios'));
  }, []);

  const navigate = useNavigate();

const handleEdit = (id) => {
  navigate(`/editar-usuario/${id}`);
};

const handleDelete = async (id) => {
  const confirmed = window.confirm('¿Estás seguro de eliminar este usuario?');
  if (confirmed) {
    try {
      await deleteUser(id);
      // Filtramos el usuario eliminado de la lista:
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (err) {
      setError('Error al eliminar el usuario');
    }
  }
};


  return (
    <>
      <Navbar />
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
                <button className="btn btn--small" onClick={() => handleEdit(u.id)}>Editar</button>
                <button className="btn btn--small btn--danger" onClick={() => handleDelete(u.id)}>Eliminar</button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminPanel;
