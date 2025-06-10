// src/pages/ChatPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getServiceById, getMe } from '../utils/api';
import ChatWindow from '../components/ChatWindow';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/ChatPage.scss';


const ChatPage = () => {
  const { servicioId } = useParams();
  const { state }      = useLocation();
  const otherUserId    = state?.otherUserId;
  const [svc, setSvc]  = useState(null);
  const [me, setMe]    = useState(null);
  const [err, setErr]  = useState('');

  useEffect(() => {
    async function load() {
      try {
        const [sRes, uRes] = await Promise.all([
          getServiceById(servicioId),
          getMe()
        ]);
        setSvc(sRes.data.data || sRes.data);
        setMe(uRes.data.data || uRes.data);
      } catch (e) {
        setErr(e.response?.data?.message || 'Error cargando chat');
      }
    }
    load();
  }, [servicioId]);

  if (err) return <div className="alert alert--error">{err}</div>;
  if (!svc || !me) return <div>Cargando chat…</div>;

  return (
    <div className="chat-page">
      <Navbar /> 
      <div className="Title">
      <h2>Chat – {svc.titulo}</h2>
      </div>
      <div className="Body">
      <ChatWindow
        servicioId={svc.id}
        otherUserId={otherUserId}
        meId={me.id}
      />

      </div>
      <Footer />
    </div>
  );
};

export default ChatPage;
