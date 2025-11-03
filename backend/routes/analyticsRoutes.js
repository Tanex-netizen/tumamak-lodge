import express from 'express';
import {
  getDashboardAnalytics,
  getRevenueAnalytics,
  getBookingStatistics,
  getDashboardStats,
  getMonthlyRevenueHistory,
} from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, authorize('admin', 'staff'), getDashboardAnalytics);
router.get('/dashboard-stats', protect, authorize('admin', 'staff'), getDashboardStats);
router.get('/revenue', protect, authorize('admin', 'staff'), getRevenueAnalytics);
router.get('/bookings', protect, authorize('admin', 'staff'), getBookingStatistics);
router.get('/monthly-revenue', protect, authorize('admin', 'staff'), getMonthlyRevenueHistory);

export default router;
