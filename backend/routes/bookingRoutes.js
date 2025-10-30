import express from 'express';
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  updatePaymentStatus,
  cancelBooking,
  deleteBooking,
  getBookedDatesForRoom,
  createWalkInBooking,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, authorize('admin', 'staff'), getAllBookings);

router.post('/walk-in', protect, authorize('admin', 'staff'), createWalkInBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/room/:roomId/booked-dates', getBookedDatesForRoom); // Public route

router.route('/:id')
  .get(protect, getBookingById)
  .delete(protect, authorize('admin'), deleteBooking);

router.put('/:id/status', protect, authorize('admin', 'staff'), updateBookingStatus);
router.put('/:id/payment', protect, authorize('admin', 'staff'), updatePaymentStatus);
router.put('/:id/cancel', protect, cancelBooking);

export default router;
