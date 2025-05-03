// src/pages/SearchServicesPage.jsx
import React, { useEffect, useState } from 'react';
import { getServices } from '../utils/api';
import '../styles/SearchServicesPage.scss';

const SearchServicesPage = () => {
  const [services, setServices]       = useState([]);
  const [searchText, setSearchText]   = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [zonaFilter, setZonaFilter]   = useState('');
  const [error, setError]             = useState('');

  useEffect(() => {
    getServices()
      .then(res => setServices(res.data.data || res.data))
      .catch(err => setError(err.response?.data?.message || 'Error cargando servicios'));
  }, []);

  const filtered = services.filter(s => {
    const matchText = searchText === '' ||
      s.titulo.toLowerCase().includes(searchText.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(searchText.toLowerCase());
    const matchCat = categoryFilter === '' || s.categoria === categoryFilter;
    const matchZona= zonaFilter === '' || s.zona.toLowerCase().includes(zonaFilter.toLowerCase());
    return matchText && matchCat && matchZona;
  });

  const categories = Array.from(new Set(services.map(s => s.categoria)));

  return (
    <div className="search-services-page">
      <h2>Buscar Servicios</h2>
      {error && <div className="alert alert--error">{error}</div>}

      <div className="filters">
        <input
          type="text"
          placeholder="Buscar por texto..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
        />
        <select
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Filtrar por zona..."
          value={zonaFilter}
          onChange={e => setZonaFilter(e.target.value)}
        />
      </div>

      <div className="results-grid">
        {filtered.map(s => (
          <div key={s.id} className="service-card">
            <h3>{s.titulo}</h3>
            <p>{s.descripcion.slice(0, 100)}...</p>
            <p><strong>Precio:</strong> ${s.precio}</p>
            <p><strong>Categoría:</strong> {s.categoria}</p>
            <p><strong>Zona:</strong> {s.zona}</p>
            <button onClick={() => window.location.href = `/servicios/${s.id}`} className="btn">
              Ver detalle
            </button>
          </div>
        ))}
        {filtered.length === 0 && <p className="no-results">No se encontraron servicios.</p>}
      </div>
    </div>
  );
};

export default SearchServicesPage;
