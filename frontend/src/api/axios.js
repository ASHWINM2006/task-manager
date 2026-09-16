import axios from 'axios';

// Production: set VITE_API_URL in Vercel environment variables
// e.g. https://taskflow-backend.onrender.com
// Development: Vite proxy handles /api → localhost:5000
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000, // 10 second timeout — Render free tier can be slow to wake up
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if NOT already on login page — prevents redirect loop
      if (window.location.pathname !== '/') {
        window.location.replace('/');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
