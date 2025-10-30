import express from 'express';
import {
  createVehicleRental,
  getMyRentals,
  getAllRentals,
  getRentalById,
  updateRentalStatus,
  updatePaymentStatus,
  cancelRental,
  deleteRental,
} from '../controllers/vehicleRentalController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
// None - all rental routes require authentication

// Protected routes (user must be logged in)
router.route('/').post(protect, createVehicleRental).get(protect, authorize('admin', 'staff'), getAllRentals);

router.route('/my-rentals').get(protect, getMyRentals);

router.route('/:id').get(protect, getRentalById);

router.route('/:id/status').put(protect, authorize('admin', 'staff'), updateRentalStatus);

router.route('/:id/payment').put(protect, authorize('admin', 'staff'), updatePaymentStatus);

router.route('/:id/cancel').put(protect, cancelRental);

router.route('/:id').delete(protect, authorize('admin'), deleteRental);

export default router;
