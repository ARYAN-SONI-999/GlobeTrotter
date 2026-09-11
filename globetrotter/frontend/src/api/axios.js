import axios from 'axios';

// Resolves and normalizes the backend API base URL
function getBaseUrl() {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl || typeof envUrl !== 'string' || envUrl.trim() === '') {
    return '/api';
  }
  let url = envUrl.trim();
  // If protocol is omitted (e.g. from Render blueprint or environment variable)
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
    url = `https://${url}`;
  }
  // Ensure the /api path suffix is present
  if (!url.endsWith('/api') && !url.endsWith('/api/')) {
    url = `${url.replace(/\/+$/, '')}/api`;
  }
  return url;
}

const api = axios.create({
  baseURL: getBaseUrl()
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token expired or invalid, clear cached credentials
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/signup' &&
        !window.location.pathname.startsWith('/share/')
      ) {
        localStorage.removeItem('gt_token');
        localStorage.removeItem('gt_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
