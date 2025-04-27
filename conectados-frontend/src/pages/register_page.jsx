import React, { useState } from 'react';
import '../styles/register_page.scss'; // Asegúrate de importar el archivo SCSS correcto

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    acceptTerms: false,
    userType: '', // Nuevo estado para el tipo de usuario (consumidor o proveedor)
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    if (!formData.acceptTerms) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }
    if (!formData.userType) {
      alert("Debes seleccionar un tipo de perfil");
      return;
    }
    console.log(formData);
    // Aquí puedes manejar el envío del formulario, como hacer una llamada a una API
  };

  return (
    <div className="register-page">
      <div className="form-container">
        <h1>Crear Cuenta</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Nombre completo"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="tel"
              placeholder="Número de teléfono (opcional)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>
          
          {/* Campo para seleccionar tipo de perfil (consumidor o proveedor) */}
          <div className="input-group">
            <label>¿Qué tipo de perfil deseas?</label>
            <div className="user-type-options">
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="consumidor"
                  checked={formData.userType === 'consumidor'}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                />
                Consumidor
              </label>
              <label>
                <input
                  type="radio"
                  name="userType"
                  value="proveedor"
                  checked={formData.userType === 'proveedor'}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                />
                Proveedor de servicios
              </label>
            </div>
          </div>

          <div className="submit-group">
            <input type="submit" value="Registrarse" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
