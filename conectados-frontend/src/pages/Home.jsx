import React from 'react';
import Navbar from '../components/Navbar';

const Home = () => {
  const containerStyle = {
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  };

  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '1rem',
    textAlign: 'center',
    transition: 'transform 0.2s',
    cursor: 'pointer',
  };

  const handleHover = (e) => {
    e.currentTarget.style.transform = 'scale(1.05)';
  };

  const handleLeave = (e) => {
    e.currentTarget.style.transform = 'scale(1)';
  };

  // Servicios de ejemplo
  const services = [
    { name: 'Eventos', description: 'Organiza y descubre eventos' },
    { name: 'Chats', description: 'Conversa en tiempo real' },
    { name: 'Streaming', description: 'Participa en transmisiones' },
    { name: 'Networking', description: 'Conecta con profesionales' },
    { name: 'Talleres', description: 'Aprende y enseña habilidades' },
    { name: 'Comunidades', description: 'Únete a grupos de interés' },
    { name: 'Noticias', description: 'Mantente informado' },
    { name: 'Marketplace', description: 'Compra y vende productos' },
  ];

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h1 style={{ textAlign: 'center' }}>Bienvenido a Conectados</h1>
        <div style={gridStyle}>
          {services.map((service, index) => (
            <div
              key={index}
              style={cardStyle}
              onMouseEnter={handleHover}
              onMouseLeave={handleLeave}
            >
              <h3>{service.name}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
