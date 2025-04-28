import axios from 'axios';
import jwtDecode from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';


const api = axios.create({
  baseURL: API_URL,
});

// Inyecta el JWT en cada petición
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export function register(data) {
  // data: { nombre, correo, password }
  return api.post('/auth/register', data);
}

export function login(data) {
  // data: { correo, password }
  return api.post('/auth/login', data);
}

// Servicios
export function getServices() {
  return api.get('/servicios');
}

export function createService(data) {
  // data: { titulo, descripcion, precio, categoria, zona, duracion }
  return api.post('/servicios', data);
}

// Reservas
export function getBookings() {
  return api.get('/bookings');
}

export function createBooking(data) {
  // data: { servicioId, fecha_hora }
  return api.post('/bookings', data);
}

export function updateBooking(id, body) {
  // body: { estado }
  return api.patch(`/bookings/${id}`, body);
}

export default api;
