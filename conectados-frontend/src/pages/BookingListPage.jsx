import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer';
import {
  getBookings,
  updateBooking,
  deleteBooking,
  createReview
} from '../utils/api';

import '../styles/BookingListPage.scss';

const BookingListPage = () => {
  const [bookings, setBookings]   = useState([]);
  const [error, setError]         = useState('');
  const [feedback, setFeedback]   = useState('');
  const [comentarios, setComentarios] = useState({});
  const [ratings, setRatings] = useState({});
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

  const handleReviewSubmit = async (bookingId, servicioId) => {
    setError('');
    setFeedback('');
    try {
      const comentario = comentarios[bookingId] || '';
      const puntuacion = ratings[bookingId] || 5;
      await createReview({ servicioId, puntuacion, comentario });
      setFeedback('Reseña enviada correctamente');
      setComentarios(prev => ({ ...prev, [bookingId]: '' }));
      setRatings(prev => ({ ...prev, [bookingId]: 5 }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar reseña');
    }
  };

  const renderStarSelector = (bookingId) => {
    const current = ratings[bookingId] || 5;
    return (
      <div className="star-selector">
        {[1, 2, 3, 4, 5].map(star => (
          <span
            key={star}
            onClick={() => setRatings(prev => ({ ...prev, [bookingId]: star }))}
            style={{
              cursor: 'pointer',
              color: star <= current ? '#FFD700' : '#ccc',
              fontSize: '20px'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="booking-list-page">
      <Navbar /> 
      <div className="Title">
        <h2>Mis Reservas</h2>
      </div>

      {error && <div className="alert alert--error">{error}</div>}
      {feedback && <div className="alert alert--success">{feedback}</div>}

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
                  <button onClick={() => handleUpdate(b.id, 'confirmada')} className="btn">Confirmar</button>
                  <button onClick={() => handleUpdate(b.id, 'cancelada')} className="btn btn--danger">Rechazar</button>
                </div>
              )}

              {userRole === 'usuario' && b.estado === 'pendiente' && (
                <button onClick={() => handleDelete(b.id)} className="btn btn--danger">Cancelar</button>
              )}

              {userRole === 'prestador' && b.estado === 'confirmada' && (
                <button onClick={() => handleUpdate(b.id, 'realizada')} className="btn btn--success">Marcar como realizada</button>
              )}

              {userRole === 'usuario' && b.estado === 'realizada' && (
                <form onSubmit={e => { e.preventDefault(); handleReviewSubmit(b.id, b.servicio.id); }}>
                  {renderStarSelector(b.id)}
                  <textarea
                    placeholder="Deja tu comentario"
                    value={comentarios[b.id] || ''}
                    onChange={e => setComentarios(prev => ({ ...prev, [b.id]: e.target.value }))}
                  />
                  <button type="submit" className="btn btn--small">Dejar reseña</button>
                </form>
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
