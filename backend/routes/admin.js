import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/authorize.js';
import {
  // Bus
  getAllBuses,
  createBus,
  updateBus,
  deleteBus,
  // Route
  getAllRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
  // Booking
  getAllBookings,
  getBookingById,
  cancelBooking,
  // User
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  // Dashboard
  getDashboardStats
} from '../controllers/admin.controller.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware, authorizeRoles('admin', 'super_admin'));

// ============= DASHBOARD =============
router.get('/dashboard/stats', getDashboardStats);

// ============= BUS MANAGEMENT =============
router.get('/buses', getAllBuses);
router.post('/buses', createBus);
router.put('/buses/:id', updateBus);
router.delete('/buses/:id', deleteBus);

// ============= ROUTE MANAGEMENT =============
router.get('/routes', getAllRoutes);
router.post('/routes', createRoute);
router.put('/routes/:id', updateRoute);
router.delete('/routes/:id', deleteRoute);

// ============= BOOKING MANAGEMENT =============
router.get('/bookings', getAllBookings);
router.get('/bookings/:id', getBookingById);
router.put('/bookings/:id/cancel', cancelBooking);

// ============= USER MANAGEMENT =============
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

export default router;
