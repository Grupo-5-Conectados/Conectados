// src/components/ChatWindow.jsx
import React, { useEffect, useState, useRef } from 'react';
import { socket, connectSocket } from '../socket';
import { getChatHistory, sendMessage } from '../utils/api';
import '../styles/ChatWindow.scss';

const ChatWindow = ({ servicioId, otherUserId }) => {
  const [msgs, setMsgs]     = useState([]);
  const [draft, setDraft]   = useState('');
  const [ready, setReady]   = useState(false);
  const endRef              = useRef();

  useEffect(() => {
    // 1) Conectar WS
    connectSocket();

    // 2) Cargar historial HTTP
    (async () => {
      try {
        const res = await getChatHistory(servicioId);
        setMsgs(res.data.data || []);
      } catch (e) {
        console.error('Error cargando historial:', e);
      }
    })();

    // 3) Listeners de WS
    const onConnect = () => {
      setReady(true);
      socket.emit('joinRoom', { servicioId });
    };
    const onDisconnect = () => setReady(false);
    const onMessage = m => setMsgs(prev => [...prev, m]);

    socket.on('connect',    onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('message',    onMessage);

    return () => {
      socket.off('connect',    onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('message',    onMessage);
    };
  }, [servicioId]);

  // Auto‐scroll al final
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const onSend = async () => {
    if (!draft.trim()) return;
    try {
      await sendMessage(servicioId, otherUserId, draft);
      setDraft('');
      // el servidor emite el 'message' y lo recibimos arriba
    } catch (e) {
      console.error('Error enviando mensaje:', e);
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-window__status">
        Estado: {ready
          ? <span className="connected">Conectado</span>
          : <span className="disconnected">Desconectado</span>}
      </div>
      <div className="chat-window__body">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`chat-bubble ${
              m.fromUserId === +localStorage.getItem('userId')
                ? 'sent'
                : 'recv'
            }`}
          >
            <div className="message-content">{m.content}</div>
            <div className="message-time">
              {new Date(m.created_at).toLocaleTimeString([], {
                hour:   '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="chat-window__footer">
        <input
          type="text"
          placeholder={ready ? 'Escribe un mensaje…' : 'Conectando…'}
          value={draft}
          disabled={!ready}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onSend()}
        />
        <button
          onClick={onSend}
          disabled={!ready || !draft.trim()}
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
