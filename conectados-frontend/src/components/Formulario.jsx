import React, { useState } from 'react';

const Formulario = ({ onSubmit, initialData = {} }) => {
  const [nombre, setNombre] = useState(initialData.nombre || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ nombre });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Nombre:</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <button type="submit">Guardar</button>
    </form>
  );
};

export default Formulario;
