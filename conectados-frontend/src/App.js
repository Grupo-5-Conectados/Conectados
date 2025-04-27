// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from './pages/AdminPanel';
import Home from './pages/Home';
import RegisterPage from "./pages/register_page";
import LoginPage from "./pages/login_page";
import CreateBusinessPage from './pages/Crear';
import Editar from './pages/Editar';
import PrivateRoute from './components/PrivateRoute';  // Asegúrate de importar PrivateRoute

import './styles/global.scss';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Ruta protegida para Admin */}
        <Route
          path="/panel-admin"
          element={
            <PrivateRoute
              element={<AdminPanel />}
              allowedRoles={['admin']}
            />
          }
        />

        {/* Rutas protegidas para Profesionales y Clientes */}
        <Route
          path="/crear"
          element={
            <PrivateRoute
              element={<CreateBusinessPage />}
              allowedRoles={['profesional', 'admin']}
            />
          }
        />
        <Route
          path="/editar/:id"
          element={
            <PrivateRoute
              element={<Editar />}
              allowedRoles={['profesional', 'admin']}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
