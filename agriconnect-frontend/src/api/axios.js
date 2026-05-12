import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agriconnect_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error?.response) {
      error.message = `Cannot reach API at ${baseURL}. Make sure backend is running.`;
    }
    if (error?.response?.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
