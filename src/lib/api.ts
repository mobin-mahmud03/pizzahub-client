import axios from 'axios';
import { authClient } from './auth-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // Servers on free hosting cold start slowly
  headers: {
    'Content-Type': 'application/json',
  },
});

// In-memory token cache
let cachedToken: string | null = null;
let tokenExpiresAt: number = 0; // timestamp in milliseconds

function parseJwtExp(jwt: string): number | null {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    const parsed = JSON.parse(jsonPayload);
    return typeof parsed.exp === 'number' ? parsed.exp : null;
  } catch {
    return null;
  }
}

async function getValidToken(): Promise<string | null> {
  const now = Date.now();
  // Return cached token if valid for at least another 10 seconds
  if (cachedToken && tokenExpiresAt > now + 10000) {
    return cachedToken;
  }

  try {
    const res = await authClient.token();
    const token = (res as any)?.data?.token;
    if (token) {
      cachedToken = token;
      const exp = parseJwtExp(token);
      if (exp) {
        tokenExpiresAt = exp * 1000;
      } else {
        tokenExpiresAt = now + 5 * 60 * 1000; // default 5 min fallback
      }
      return token;
    }
  } catch (err) {
    console.warn('[API Interceptor] Error retrieving Better Auth JWT token:', err);
  }
  return null;
}

// Request interceptor to attach JWT token
api.interceptors.request.use(
  async (config) => {
    if (typeof window !== 'undefined') {
      const token = await getValidToken();
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
    // Invalidate cached token on 401 responses
    if (error.response?.status === 401) {
      cachedToken = null;
      tokenExpiresAt = 0;
      if (typeof window !== 'undefined' && !error.config?.url?.includes('/auth/me')) {
        console.warn('[API] Unauthorized request. Token may be invalid or expired.');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
