// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AdminPanel         from './pages/AdminPanel.jsx';
import Home               from './pages/Home.jsx';
import RegisterPage       from './pages/RegisterPage.jsx';
import LoginPage          from './pages/LoginPage.jsx';
import ServiceListPage    from './pages/ServiceListPage.jsx';
import ServiceDetailPage  from './pages/ServiceDetailPage.jsx';
import CreateServicePage  from './pages/CreateServicePage.jsx';
import Editar             from './pages/Editar.jsx';
import BookingListPage    from './pages/BookingListPage.jsx';
import UserListPage       from './pages/UserListPage.jsx';
import UserEditPage       from './pages/UserEditPage.jsx';
import CreateUserPage     from './pages/CreateUserPage.jsx';
import ProfilePage        from './pages/ProfilePage.jsx';  // ← Nuevo
import PrivateRoute       from './components/PrivateRoute.js';

import './styles/global.scss';
import SearchServicesPage from './pages/SearchServicesPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        {/* Públicas */}
        <Route path="/"         element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login"    element={<LoginPage />} />

        {/* Perfil (usuarios logueados) */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute
              element={<ProfilePage />}
              allowedRoles={['usuario','prestador','admin']}
            />
          }
        />

        {/* Servicios */}
        <Route path="/servicios"     element={<ServiceListPage />} />
        <Route path="/servicios/:id" element={<ServiceDetailPage />} />

         {/* Mis Citas (solo usuarios clientes) */}
         <Route
          path="/mis-citas"
          element={
            <PrivateRoute
              element={<BookingListPage />}
              allowedRoles={['usuario']}
            />
          }
        />
        <Route
        path="/buscar-servicios"
        element={
          <PrivateRoute
            element={<SearchServicesPage />}
            allowedRoles={['usuario']}
          />
        }
      />

        {/* Mi Agenda (solo prestadores) */}
        <Route
          path="/agenda"
          element={
            <PrivateRoute
              element={<BookingListPage />}
              allowedRoles={['prestador']}
            />
          }
        />
        {/* Creación / edición de servicios */}
        <Route
          path="/crear"
          element={
            <PrivateRoute
              element={<CreateServicePage />}
              allowedRoles={['prestador','admin']}
            />
          }
        />
        <Route
          path="/editar/:id"
          element={
            <PrivateRoute
              element={<Editar />}
              allowedRoles={['prestador','admin']}
            />
          }
        />

        {/* Administración de usuarios (solo admin) */}
        <Route
          path="/gestion-usuarios"
          element={
            <PrivateRoute
              element={<UserListPage />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route
          path="/editar-usuario/:id"
          element={
            <PrivateRoute
              element={<UserEditPage />}
              allowedRoles={['admin']}
            />
          }
        />
        <Route
          path="/crear-usuario"
          element={
            <PrivateRoute
              element={<CreateUserPage />}
              allowedRoles={['admin']}
            />
          }
        />

        {/* Panel admin general */}
        <Route
          path="/panel-admin"
          element={
            <PrivateRoute
              element={<AdminPanel />}
              allowedRoles={['admin']}
            />
          }
        />

        {/* Fallback 404 */}
        <Route path="*" element={<h2>Página no encontrada</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
