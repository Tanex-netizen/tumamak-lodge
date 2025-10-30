import express from 'express';
import {
  getRooms,
  getRoomById,
  checkAvailability,
  getBookedDates,
  createRoom,
  updateRoom,
  deleteRoomImage,
  deleteRoom,
} from '../controllers/roomController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(protect, authorize('admin', 'staff'), upload.array('images', 5), createRoom);

router.post('/check-availability', checkAvailability);

router.route('/:id')
  .get(getRoomById)
  .put(protect, authorize('admin', 'staff'), upload.array('images', 5), updateRoom)
  .delete(protect, authorize('admin'), deleteRoom);

router.get('/:id/booked-dates', getBookedDates);

router.delete(
  '/:id/images/:publicId',
  protect,
  authorize('admin', 'staff'),
  deleteRoomImage
);

export default router;
