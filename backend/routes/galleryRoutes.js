import express from 'express';
import {
  getGalleryImages,
  getGalleryImageById,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
} from '../controllers/galleryController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getGalleryImages)
  .post(protect, authorize('admin', 'staff'), upload.single('image'), uploadGalleryImage);

router.route('/:id')
  .get(getGalleryImageById)
  .put(protect, authorize('admin', 'staff'), upload.single('image'), updateGalleryImage)
  .delete(protect, authorize('admin'), deleteGalleryImage);

export default router;
