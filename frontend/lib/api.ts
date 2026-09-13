import axios from 'axios';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api';

export const api = axios.create({ baseURL: API_URL });

// attach the JWT from localStorage to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// on 401, clear the session and bounce to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window !== 'undefined' && err?.response?.status === 401) {
      localStorage.removeItem('token');
      if (!location.pathname.startsWith('/login')) location.href = '/login';
    }
    return Promise.reject(err);
  },
);
