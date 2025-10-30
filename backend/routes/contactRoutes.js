import express from 'express';
import {
  submitContactForm,
  getContactMessages,
  getContactMessageById,
  updateContactMessage,
  deleteContactMessage,
} from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(submitContactForm)
  .get(protect, authorize('admin', 'staff'), getContactMessages);

router.route('/:id')
  .get(protect, authorize('admin', 'staff'), getContactMessageById)
  .put(protect, authorize('admin', 'staff'), updateContactMessage)
  .delete(protect, authorize('admin'), deleteContactMessage);

export default router;
