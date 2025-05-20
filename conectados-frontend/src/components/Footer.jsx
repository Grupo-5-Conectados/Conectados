import React from 'react';
import '../styles/Footer.scss';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>Conectados</h2>
          <p>Conectando servicios con personas.</p>
        </div>

        <div className="footer-links">
          <h4>Visita</h4>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/servicios">Servicios</a></li>
            <li><a href="/about">Nosotros</a></li>

          </ul>
        </div>

        <div className="footer-social">
          <h4>Síguenos</h4>
          <div className="social-icons">
            <li><a href="http://facebook.com">Facebook<i className="fab fa-facebook"></i></a></li>
            <li><a href="http://instagram.com/">Twitter<i className="fab fa-twitter"></i></a></li>
            <li><a href="http://twitter.com/">Instagram<i className="fab fa-instagram"></i></a></li>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Conectados. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

export default Footer;
