// src/pages/ServiceDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getServiceById,
  getDisponibilidadPrestador,
  createBooking
} from '../utils/api';
import ChatWindow from '../components/ChatWindow';
import '../styles/ServiceDetailPage.scss';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ServiceDetailPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [slots, setSlots] = useState([]);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [showChat, setShowChat] = useState(false);
  const userRole = localStorage.getItem('userRole'); // 'usuario', 'prestador', 'admin' o null

  useEffect(() => {
    getServiceById(id)
      .then(res => setService(res.data.data || res.data))
      .catch(err => setError(err.response?.data?.message || 'Error al cargar detalle'));

    if (userRole) {
      getDisponibilidadPrestador(id)
        .then(res => setSlots(res.data.data || res.data))
        .catch(() => {});
    }
  }, [id, userRole]);

  const handleBook = async slot => {
    setBookingError('');
    setBookingSuccess('');
    try {
      await createBooking({
        servicioId: id,
        fecha_hora: slot.fecha_hora
      });
      setBookingSuccess('Reserva creada. Estado pendiente.');
      setSlots(slots.filter(s => s.id !== slot.id));
    } catch (err) {
      setBookingError(err.response?.data?.message || 'Error al crear reserva');
    }
  };

  if (error) return <div className="alert alert--error">{error}</div>;
  if (!service) return <div>Cargando...</div>;

  return (
    <div className="service-detail-page">
      <Navbar />
      <div className="Body">
        <div className="service-detail__container">
          <div className="service-detail__info">
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

            {/* Botón para abrir/cerrar chat */}
            {userRole === 'usuario' && (
              <button
                className="btn btn--chat"
                onClick={() => setShowChat(!showChat)}
              >
                {showChat ? 'Cerrar Chat' : 'Chatear con prestador'}
              </button>
            )}

            {/* Ventana de chat */}
            {showChat && (
              <ChatWindow
                servicioId={service.id}
                otherUserId={service.prestador.id}
              />
            )}
          </div>

          <div className="available-slots">
            <h3>Horarios disponibles</h3>

            {!userRole && (
              <p>Inicia sesión para ver los horarios disponibles.</p>
            )}

            {userRole && slots.length === 0 && (
              <p>No hay horarios disponibles.</p>
            )}

            {userRole && slots.length > 0 && (
              <ul>
                {slots.map(slot => (
                  <li key={slot.id}>
                    {new Date(slot.fecha_hora).toLocaleString()}
                    {userRole === 'usuario' && (
                      <button
                        onClick={() => handleBook(slot)}
                        className="btn btn--small"
                      >
                        Reservar
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {userRole === 'usuario' && bookingError && (
              <div className="alert alert--error">{bookingError}</div>
            )}
            {userRole === 'usuario' && bookingSuccess && (
              <div className="alert alert--success">{bookingSuccess}</div>
            )}
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
