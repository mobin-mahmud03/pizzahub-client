import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Servers on free hosting cold start slowly
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('pizzahub_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 occurs due to expired token during API call
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Don't auto-redirect if checking auth state on refresh
      if (!error.config.url.includes('/auth/me')) {
        console.warn('[API] Unauthorized request. Token may be invalid or expired.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
