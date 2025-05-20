// src/pages/Home.jsx
import React from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/Home.scss';

const Home = () => {
  const services = [
    { name: 'Eventos',     description: 'Organiza y descubre eventos' },
    { name: 'Chats',       description: 'Conversa en tiempo real' },
    { name: 'Streaming',   description: 'Participa en transmisiones' },
    { name: 'Networking',  description: 'Conecta con profesionales' },
    { name: 'Talleres',    description: 'Aprende y enseña habilidades' },
    { name: 'Comunidades', description: 'Únete a grupos de interés' },
    { name: 'Noticias',    description: 'Mantente informado' },
    { name: 'Marketplace', description: 'Compra y vende productos' }
  ];

  return (
    <div className="home-page">
      <Navbar />
      <div className="home-page__hero">
        <h1>Bienvenido a Conectados</h1>
        <p>Tu plataforma para encontrar servicios, eventos y más.</p>
      </div>
      <div className="home-page__grid">
        {services.map((s, idx) => (
          <div key={idx} className="home-page__card">
            <h3>{s.name}</h3>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default Home;
