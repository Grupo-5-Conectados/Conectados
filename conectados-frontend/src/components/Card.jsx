import React from 'react';
import '../styles/card.scss'; // Asegúrate de tener este archivo SCSS para los estilos

const Card = ({ servicio }) => {
  return (
    <div className="card">
      <div className="card-image">
        {servicio.imagenUrl && (
          <img src={servicio.imagenUrl} alt={servicio.titulo} />
        )}
      </div>
      <div className="card-content">
        <h3>{servicio.titulo}</h3>
        <p className="category">{servicio.categoria}</p>
        <p>{servicio.descripcion}</p>
        <p className="price">Precio: ${servicio.precio}</p>
        <p className="zona">Zona: {servicio.zona}</p>
        <div className="card-footer">
          <p>Duración: {servicio.duracion ? `${servicio.duracion} minutos` : 'N/A'}</p>
          <p>Prestador: {servicio.prestador.nombre}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
