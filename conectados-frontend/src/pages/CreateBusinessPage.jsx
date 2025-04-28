import React, { useState } from 'react';
import { createService } from '../utils/api';

const CreateBusinessPage = () => {
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    precio: '',
    categoria: '',
    zona: '',
    duracion: ''
  });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await createService({
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        precio: parseFloat(formData.precio),
        categoria: formData.categoria,
        zona: formData.zona,
        duracion: parseInt(formData.duracion, 10)
      });
      alert('Servicio publicado correctamente');
      setFormData({
        titulo: '',
        descripcion: '',
        precio: '',
        categoria: '',
        zona: '',
        duracion: ''
      });
    } catch (err) {
      alert(
        'Error al publicar servicio: ' +
          (err.response?.data?.error || err.message)
      );
    }
  };

  return (
    <div className="create-business-page">
      <h1>Publicar Servicio</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título del servicio"
          value={formData.titulo}
          onChange={e =>
            setFormData({ ...formData, titulo: e.target.value })
          }
          required
        />
        <textarea
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={e =>
            setFormData({ ...formData, descripcion: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Precio"
          value={formData.precio}
          onChange={e =>
            setFormData({ ...formData, precio: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Categoría"
          value={formData.categoria}
          onChange={e =>
            setFormData({ ...formData, categoria: e.target.value })
          }
          required
        />
        <input
          type="text"
          placeholder="Zona"
          value={formData.zona}
          onChange={e =>
            setFormData({ ...formData, zona: e.target.value })
          }
          required
        />
        <input
          type="number"
          placeholder="Duración (horas)"
          value={formData.duracion}
          onChange={e =>
            setFormData({ ...formData, duracion: e.target.value })
          }
        />
        <button type="submit">Publicar</button>
      </form>
    </div>
  );
};

export default CreateBusinessPage;
