// src/socket.js
import { io } from 'socket.io-client';

const BACKEND = process.env.REACT_APP_API_URL?.replace('/api','') || 'http://localhost:4000';

export const socket = io(BACKEND, {
  autoConnect: false,
  transports: ['polling','websocket'],
  auth: {
    token: localStorage.getItem('token')
  }
});

socket.on('connect',    () => console.log('✅ WS conectado:', socket.id));
socket.on('disconnect', reason => console.log('❌ WS desconectado:', reason));
socket.on('connect_error', err => {
  console.error('🔥 WS error:', err.message);
  setTimeout(() => socket.connect(), 2000);
});

export const connectSocket = () => {
  if (!socket.connected) socket.connect();
};
