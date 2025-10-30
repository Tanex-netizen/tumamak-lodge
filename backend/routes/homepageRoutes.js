import express from 'express';
import {
  getHomepageContent,
  getHomepageSection,
  upsertHomepageSection,
  deleteHomepageSection,
} from '../controllers/homepageController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getHomepageContent);

router.route('/:section')
  .get(getHomepageSection)
  .post(protect, authorize('admin'), upsertHomepageSection)
  .delete(protect, authorize('admin'), deleteHomepageSection);

export default router;
