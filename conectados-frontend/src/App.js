// src/App.js
import React, { useEffect } from 'react';
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
import ProfilePage        from './pages/ProfilePage.jsx';
import ChatListPage       from './pages/ChatListPage.jsx';   // muestra lista de conversaciones
import ChatPage           from './pages/ChatPage.jsx';       // ventana de chat por servicio
import SearchServicesPage from './pages/SearchServicesPage.jsx';
import PrivateRoute       from './components/PrivateRoute.js';

import { useAuth } from './hooks/useAuth';
import { socket, connectSocket } from './socket';
import './styles/global.scss';

function App() {
  const { user } = useAuth(); // Asume que tienes un hook useAuth

  useEffect(() => {
    if (user?.token) {
      // Conectar el socket cuando el usuario está autenticado
      connectSocket(user.token);
    }

    return () => {
      // Limpieza al desmontar el componente
      if (socket.connected) {
        socket.disconnect();
      }
    };
  }, [user?.token]);
  return (
    <Router>
      <Routes>
        {/* Públicas */}
        <Route path="/"         element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login"    element={<LoginPage />} />

        {/* Perfil (todos los logueados) */}
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

        {/* Chat: lista de conversaciones */}
        {/* Mis Mensajes (lista de chats) */}
        <Route
          path="/mensajes"
          element={
            <PrivateRoute
              element={<ChatListPage />}
              allowedRoles={['usuario','prestador']}
            />
          }
        />

        {/* Ventana de chat para un servicio concreto */}
        <Route
          path="/chats/:servicioId"
          element={
            <PrivateRoute
              element={<ChatPage />}
              allowedRoles={['usuario','prestador']}
            />
          }
        />

        {/* Mis Citas (sólo usuario) */}
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

        {/* Mi Agenda (sólo prestador) */}
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

        {/* Administración de usuarios (sólo admin) */}
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
