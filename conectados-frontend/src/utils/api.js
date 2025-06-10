// src/utils/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const api = axios.create({ baseURL: API_URL });

// Inyecta el JWT en cada petición
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export function register(data) {
  return api.post('/auth/register', data);
}
export function login(data) {
  return api.post('/auth/login', data);
}

// Usuarios (para AdminPanel y CRUD)
export function getUsers() {
  return api.get('/usuarios');
}
export function createUser(data) {
  return api.post('/usuarios', data);
}
export function updateUser(id, data) {
  return api.put(`/usuarios/${id}`, data);
}
export function deleteUser(id) {
  return api.delete(`/usuarios/${id}`);
}
export function getUserById(id) {              // ← AÑADIDO
  return api.get(`/usuarios/${id}`);
}
export function getMe() {
  return api.get('/usuarios/me');
}
// Servicios
export function getServices() {
  return api.get('/servicios');
}
export function getServiceById(id) {
  return api.get(`/servicios/${id}`);
}
export function createService(data) {
  return api.post('/servicios', data);
}
export function updateService(id, data) {
  return api.put(`/servicios/${id}`, data);
}
export function deleteService(id) {
  return api.delete(`/servicios/${id}`);
}

// Reservas
export function getBookings() {
  return api.get('/bookings');
}
export function createBooking(data) {
  return api.post('/bookings', data);
}
export function updateBooking(id, body) {
  return api.patch(`/bookings/${id}`, body);
}
export function deleteBooking(id) {
  return api.delete(`/bookings/${id}`);
}

// Disponibilidad de un servicio (slots)
// Crear un slot para un servicio
export function createDisponibilidad(serviceId, data) {
  // POST /api/servicios/:id/slots
  return api.post(`/servicios/${serviceId}/slots`, data);
}
// Obtener slots disponibles
export function getDisponibilidadPrestador(serviceId) {
  // GET /api/servicios/:id/slots
  return api.get(`/servicios/${serviceId}/slots`);
}
// Eliminar un slot
export function deleteDisponibilidad(slotId) {
  // DELETE /api/slots/:id
  return api.delete(`/slots/${slotId}`);
}

// Chat
export function getChatHistory(servicioId) {
  return api.get(`/chats/${servicioId}`);
}
export function sendMessage(servicioId, toUserId, content) {
  return api.post(`/chats/${servicioId}`, { toUserId, content });
}

// Reviews
export function createReview(data) {
  return api.post('/reviews', data);
}
export function getMyReviews() {
  return api.get('/usuarios/mis-reviews');
}


export default api;
