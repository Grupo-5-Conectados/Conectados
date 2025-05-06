import React, { useEffect, useState } from 'react';
<<<<<<< HEAD
import {
  getBookings,
  updateBooking,
  deleteBooking
} from '../utils/api';
=======
import { updateBooking, deleteBooking, getBookings } from '../utils/api';
import Navbar from '../components/Navbar'; 
>>>>>>> aa3f525ad2646211fc8c2499457eabb78489ce89
import '../styles/BookingListPage.scss';

const BookingListPage = () => {
  const [bookings, setBookings]   = useState([]);
  const [error, setError]         = useState('');
  const [feedback, setFeedback]   = useState('');
  const userRole                  = localStorage.getItem('userRole');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    setError('');
    getBookings()
      .then(res => {
        // data comes in res.data.data or res.data
        const data = res.data.data ?? res.data;
        setBookings(data);
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Error al cargar reservas');
      });
  };

  const handleUpdate = async (id, estado) => {
    setError('');
    setFeedback('');
    try {
      await updateBooking(id, { estado });
      setFeedback(`Reserva ${estado}`);
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar reserva');
    }
  };

  const handleDelete = async id => {
    setError('');
    setFeedback('');
    try {
      await deleteBooking(id);
      setFeedback('Reserva cancelada');
      loadBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cancelar reserva');
    }
  };

  return (
<<<<<<< HEAD
    <div className="booking-list-page">
      <h2>Mis Reservas</h2>

      {error && (
        <div className="alert alert--error">
          {error}
        </div>
      )}

      {feedback && (
        <div className="alert alert--success">
          {feedback}
        </div>
      )}

      <div className="booking-list">
        {bookings.map(b => (
          <div key={b.id} className="booking-card">
            <p><strong>Servicio:</strong> {b.servicio.titulo}</p>
            <p><strong>Usuario:</strong> {b.usuario.nombre} ({b.usuario.correo})</p>
            <p><strong>Fecha:</strong> {new Date(b.fecha_hora).toLocaleString()}</p>
            <p><strong>Estado:</strong> {b.estado}</p>

            {userRole === 'prestador' && b.estado === 'pendiente' && (
              <div className="actions">
                <button
                  onClick={() => handleUpdate(b.id, 'confirmada')}
                  className="btn"
                >
                  Confirmar
                </button>
                <button
                  onClick={() => handleUpdate(b.id, 'cancelada')}
                  className="btn btn--danger"
                >
                  Rechazar
                </button>
              </div>
            )}

            {userRole === 'usuario' && b.estado === 'pendiente' && (
              <button
                onClick={() => handleDelete(b.id)}
                className="btn btn--danger"
              >
                Cancelar
              </button>
            )}
          </div>
        ))}
=======
    <div>
      <Navbar /> {/* Aquí se agrega la Navbar en la página de reservas */}

      <div className="booking-list-page">
        <h2>Mis Reservas</h2>
        {error    && <div className="alert alert--error">{error}</div>}
        {feedback && <div className="alert alert--success">{feedback}</div>}
        <div className="booking-list">
          {bookings.map(b => (
            <div key={b.id} className="booking-card">
              <p><strong>Servicio:</strong> {b.servicio.titulo}</p>
              <p><strong>Usuario:</strong> {b.usuario.nombre} ({b.usuario.correo})</p>
              <p><strong>Fecha:</strong> {new Date(b.fecha_hora).toLocaleString()}</p>
              <p><strong>Estado:</strong> {b.estado}</p>

              {userRole === 'prestador' && b.estado === 'pendiente' && (
                <div className="actions">
                  <button onClick={() => handleUpdate(b.id, 'confirmada')} className="btn">Confirmar</button>
                  <button onClick={() => handleUpdate(b.id, 'cancelada')} className="btn btn--danger">Rechazar</button>
                </div>
              )}

              {userRole === 'usuario' && b.estado === 'pendiente' && (
                <button onClick={() => handleDelete(b.id)} className="btn btn--danger">
                  Cancelar
                </button>
              )}
            </div>
          ))}
        </div>
>>>>>>> aa3f525ad2646211fc8c2499457eabb78489ce89
      </div>
    </div>
  );
};

export default BookingListPage;
