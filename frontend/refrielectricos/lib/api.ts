import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las peticiones
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores de respuesta (ej: token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si el error es 401 (Unauthorized), probablemente el token expiró
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined') {
        // Redirigir al login para forzar re-autenticación
        window.location.href = '/login?redirect=/checkout';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
