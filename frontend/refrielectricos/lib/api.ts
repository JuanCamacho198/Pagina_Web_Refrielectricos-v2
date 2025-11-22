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
        const path = window.location.pathname;
        // Lista de rutas que requieren autenticación
        const protectedRoutes = ['/checkout', '/profile', '/admin', '/orders'];
        const isProtected = protectedRoutes.some(route => path.startsWith(route));

        if (isProtected) {
          window.location.href = `/login?redirect=${encodeURIComponent(path)}`;
        }
        // Si es una ruta pública, solo cerramos sesión y no redirigimos forzosamente
      }
    }
    return Promise.reject(error);
  }
);

export default api;
