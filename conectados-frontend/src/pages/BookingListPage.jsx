import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';
import {
  getBookings,
  updateBooking,
  deleteBooking
} from '../utils/api';

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
    <div className="booking-list-page">
      <Navbar /> 
      <div className="Title">
      <h2>Mis Reservas</h2>
      </div>
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
      <div className="Body"> 
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
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingListPage;
