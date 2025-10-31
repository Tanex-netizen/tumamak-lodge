import axios from 'axios';

// Normalize VITE_API_URL at build time so the baseURL always ends with `/api`
const rawApi = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const cleaned = rawApi.replace(/\/+$/, '');
const baseApiUrl = cleaned.endsWith('/api') ? cleaned : `${cleaned}/api`;

const api = axios.create({
  baseURL: baseApiUrl,
  headers: {
    'Content-Type': 'application/json',
    // Note: browsers control CORS response headers. This client header
    // is harmless but doesn't affect server-side Access-Control-Allow-Origin.
    'Access-Control-Allow-Origin': 'true',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
