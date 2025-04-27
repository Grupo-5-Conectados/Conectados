// src/utils/api.js
import axios from 'axios';

const api = {
  login: async ({ email, password }) => {
    try {
      const response = await axios.post('/api/login', { email, password });
      return response.data; // Asume que el backend devuelve un objeto con 'success' y 'userRole'
    } catch (error) {
      console.error('Error en el login:', error);
      return { success: false };
    }
  }
};

export default api;
