import express from 'express';
import {
  createContactMessage,
  getContactMessages,
  getContactMessageById,
  getMyConversation,
  getPublicConversation,
  markMessageAsRead,
  respondToMessage,
  updateMessageStatus,
  deleteContactMessage,
  getUnreadCount,
} from '../controllers/contactMessageController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route - anyone can send a message
router.post('/', createContactMessage);

// Public route - get conversation by ID (for guests)
router.get('/public/:id', getPublicConversation);

// User route - get their own conversation
router.get('/my-conversation', protect, getMyConversation);

// Admin routes
router.get('/unread/count', protect, authorize('admin', 'staff'), getUnreadCount);
router.get('/', protect, authorize('admin', 'staff'), getContactMessages);
router.get('/:id', protect, authorize('admin', 'staff'), getContactMessageById);
router.patch('/:id/read', protect, authorize('admin', 'staff'), markMessageAsRead);
router.post('/:id/respond', protect, authorize('admin', 'staff'), respondToMessage);
router.patch('/:id/status', protect, authorize('admin', 'staff'), updateMessageStatus);
router.delete('/:id', protect, authorize('admin'), deleteContactMessage);

export default router;
