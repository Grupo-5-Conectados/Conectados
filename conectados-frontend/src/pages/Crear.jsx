import React, { useState } from 'react';

function CreateBusinessPage() {
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    businessType: '',
    contactEmail: '',
    contactPhone: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes realizar una validación y luego enviar los datos al backend o realizar alguna acción
    console.log(formData);
  };

  return (
    <div className="create-business-page">
      <div className="form-container">
        <h1>Crear Definición de Negocio</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Nombre del negocio"
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <textarea
              placeholder="Descripción del negocio"
              value={formData.businessDescription}
              onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <select
              value={formData.businessType}
              onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
              required
            >
              <option value="">Selecciona un tipo de negocio</option>
              <option value="Retail">Retail</option>
              <option value="Servicios">Servicios</option>
              <option value="Tecnología">Tecnología</option>
              <option value="Educación">Educación</option>
              <option value="Salud">Salud</option>
            </select>
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Correo electrónico de contacto"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="tel"
              placeholder="Teléfono de contacto"
              value={formData.contactPhone}
              onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              required
            />
          </div>
          <div className="submit-group">
            <input type="submit" value="Crear Negocio" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBusinessPage;
