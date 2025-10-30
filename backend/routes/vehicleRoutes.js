import express from 'express';
import {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  deleteVehicleImage,
} from '../controllers/vehicleController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getVehicles)
  .post(protect, authorize('admin', 'staff'), upload.array('images', 5), createVehicle);

router.route('/:id')
  .get(getVehicleById)
  .put(protect, authorize('admin', 'staff'), upload.array('images', 5), updateVehicle)
  .delete(protect, authorize('admin'), deleteVehicle);

router.delete(
  '/:id/images/:publicId',
  protect,
  authorize('admin', 'staff'),
  deleteVehicleImage
);

export default router;
