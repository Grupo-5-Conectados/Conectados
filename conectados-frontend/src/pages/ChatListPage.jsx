// src/pages/ChatListPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getBookings } from '../utils/api';
import '../styles/ChatListPage.scss';

const ChatListPage = () => {
  const [convs, setConvs] = useState(null);
  const [err, setErr] = useState('');

  useEffect(() => {
    getBookings()
      .then(res => {
        const bks = res.data.data || res.data;
        const map = {};
        bks.forEach(b => {
          if (b.servicio) {
            map[b.servicio.id] = {
              servicio: b.servicio,
              otherUser: b.usuario
            };
          }
        });
        setConvs(Object.values(map));
      })
      .catch(e => setErr(e.response?.data?.message || 'Error cargando chats'));
  }, []);

  if (err) return <div className="chat-list-page__error">{err}</div>;
  if (convs === null) return <div className="chat-list-page__loading">Cargando…</div>;

  return (
    <div className="chat-list-page">
      <Navbar /> 

      <h2>Mis Chats</h2>
      {convs.length === 0 ? (
        <p>No tienes conversaciones abiertas.</p>
      ) : (
        <ul className="chat-list">
          {convs.map(({ servicio, otherUser }) => (
            <li key={servicio.id} className="chat-list__item">
              <div className="chat-list__info">
                <strong>{servicio.titulo}</strong>
                <small>
                  {otherUser
                    ? `Conversas con: ${otherUser.nombre}`
                    : `Prestador: ${servicio.prestador?.nombre}`}
                </small>
              </div>
              <Link
                to={`/chats/${servicio.id}`}
                state={{ otherUserId: otherUser?.id }}
                className="chat-list__link"
              >
                Abrir Chat
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatListPage;
