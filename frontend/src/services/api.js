import axios from 'axios';

const API_URL = 'https://bus-it-backend.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (userData) => api.post('/auth/login', userData),
};

export const userAPI = {
  getCurrentUser: () => api.get('/users/me'),
  getAllUsers: () => api.get('/users'),
  updateProfile: (data) => api.put('/users/me', data),
};

export const busAPI = {
  getAllBuses: () => api.get('/buses'),
  getBusById: (id) => api.get(`/buses/${id}`),
};

export const routeAPI = {
  searchRoutes: (params) => api.get('/routes/search', { params }),
  getAllRoutes: () => api.get('/routes'),
  getRouteById: (id) => api.get(`/routes/${id}`),
};

export const bookingAPI = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getBookingByPNR: (pnr) => api.get(`/bookings/pnr/${pnr}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
};

export default api;
