import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============= ADMIN AUTH =============
export const adminAuthAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  logout: () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }
};

// ============= DASHBOARD =============
export const dashboardAPI = {
  getStats: () => api.get('/admin/dashboard/stats')
};

// ============= BUSES =============
export const busAPI = {
  getAll: () => api.get('/admin/buses'),
  getById: (id) => api.get(`/admin/buses/${id}`),
  create: (data) => api.post('/admin/buses', data),
  update: (id, data) => api.put(`/admin/buses/${id}`, data),
  delete: (id) => api.delete(`/admin/buses/${id}`)
};

// ============= ROUTES =============
export const routeAPI = {
  getAll: () => api.get('/admin/routes'),
  getById: (id) => api.get(`/admin/routes/${id}`),
  create: (data) => api.post('/admin/routes', data),
  update: (id, data) => api.put(`/admin/routes/${id}`, data),
  delete: (id) => api.delete(`/admin/routes/${id}`)
};

// ============= BOOKINGS =============
export const bookingAPI = {
  getAll: () => api.get('/admin/bookings'),
  getById: (id) => api.get(`/admin/bookings/${id}`),
  cancel: (id) => api.put(`/admin/bookings/${id}/cancel`)
};

// ============= USERS =============
export const userAPI = {
  getAll: () => api.get('/admin/users'),
  getById: (id) => api.get(`/admin/users/${id}`),
  updateRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  delete: (id) => api.delete(`/admin/users/${id}`)
};

export default api;
