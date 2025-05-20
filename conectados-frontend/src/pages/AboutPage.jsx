import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/about_page.scss';

function AboutPage() {
  return (
    <>
      <Navbar />

      <div className="about-page">
        <div className="about-hero">
          <h1>Acerca de Nosotros</h1>
          <p>Conectamos servicios con personas para facilitar la vida cotidiana.</p>
        </div>

        <div className="about-content">
          <section>
            <h2>Nuestra Misión</h2>
            <p>
              Nuestra misión es brindar una plataforma confiable que conecte consumidores con proveedores de servicios de manera rápida, segura y eficiente.
            </p>
          </section>

          <section>
            <h2>¿Quiénes Somos?</h2>
            <p>
              Somos un equipo apasionado por la tecnología, la innovación y el impacto social. Creemos que cada persona merece acceso fácil a servicios confiables, y trabajamos todos los días para hacerlo realidad.
            </p>
          </section>

          <section>
            <h2>Valores</h2>
            <ul>
              <li><strong>Confianza:</strong> Fomentamos relaciones seguras entre usuarios.</li>
              <li><strong>Calidad:</strong> Priorizamos la excelencia en cada servicio publicado.</li>
              <li><strong>Transparencia:</strong> Creemos en la comunicación abierta y clara.</li>
            </ul>
          </section>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AboutPage;
