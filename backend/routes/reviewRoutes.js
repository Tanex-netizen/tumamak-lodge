import express from 'express';
import {
  createReview,
  getRoomReviews,
  getAllReviews,
  updateReviewApproval,
  deleteReview,
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createReview)
  .get(protect, authorize('admin', 'staff'), getAllReviews);

router.get('/room/:roomId', getRoomReviews);

router.put('/:id/approve', protect, authorize('admin', 'staff'), updateReviewApproval);
router.delete('/:id', protect, authorize('admin'), deleteReview);

export default router;
