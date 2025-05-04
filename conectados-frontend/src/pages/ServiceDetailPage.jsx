// src/pages/ServiceDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getServiceById, createBooking } from '../utils/api';
import Navbar from '../components/Navbar';  // Importa la Navbar
import '../styles/ServiceDetailPage.scss';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [error, setError] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const userRole = localStorage.getItem('userRole');

  useEffect(() => {
    getServiceById(id)
      .then(res => {
        const s = res.data.data || res.data;
        setService(s);
      })
      .catch(err => setError(err.response?.data?.message || 'Error al cargar detalle'));
  }, [id]);

  const handleBooking = async e => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');
    if (!bookingDate) {
      setBookingError('Selecciona fecha y hora');
      return;
    }
    try {
      await createBooking({
        servicioId: id,
        fecha_hora: new Date(bookingDate).toISOString()
      });
      setBookingSuccess('Reserva creada. Estado pendiente.');
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Error al crear reserva');
    }
  };

  if (error) return <div className="alert alert--error">{error}</div>;
  if (!service) return <div>Cargando...</div>;

  return (
    <div className="service-detail-page">
      <Navbar />  {/* Aquí insertamos la Navbar */}
      <h2>{service.titulo}</h2>
      <p><strong>Descripción:</strong> {service.descripcion}</p>
      <p><strong>Precio:</strong> ${service.precio}</p>
      <p><strong>Categoría:</strong> {service.categoria}</p>
      <p><strong>Zona:</strong> {service.zona}</p>
      {service.duracion != null && (
        <p><strong>Duración:</strong> {service.duracion} horas</p>
      )}
      {service.imagenUrl && (
        <img
          src={service.imagenUrl}
          alt={service.titulo}
          className="service-detail__image"
        />
      )}

      {userRole === 'usuario' && (
        <form onSubmit={handleBooking} className="booking-form">
          <label>Fecha y hora:</label>
          <input
            type="datetime-local"
            value={bookingDate}
            onChange={e => setBookingDate(e.target.value)}
          />
          {bookingError && <div className="alert alert--error">{bookingError}</div>}
          {bookingSuccess && <div className="alert alert--success">{bookingSuccess}</div>}
          <button type="submit" className="btn">Reservar</button>
        </form>
      )}
    </div>
  );
};

export default ServiceDetailPage;
