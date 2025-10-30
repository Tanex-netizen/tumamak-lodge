import ContactMessage from '../models/ContactMessage.js';

// @desc    Create a new contact message / Start a conversation
// @route   POST /api/contact-messages
// @access  Public
export const createContactMessage = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    // Check if conversation already exists for this email
    let conversation = await ContactMessage.findOne({ email, status: 'active' });

    if (conversation) {
      // Add message to existing conversation
      conversation.messages.push({
        text: message,
        sender: 'customer',
        senderName: name,
      });
      conversation.lastMessageAt = Date.now();
      conversation.isRead = false;

      // Link conversation to user if they're logged in and conversation isn't already linked
      if (req.user && !conversation.userId) {
        conversation.userId = req.user._id;
      }

      await conversation.save();
    } else {
      // Create new conversation
      conversation = await ContactMessage.create({
        name,
        email,
        phone,
        userId: req.user?._id,
        messages: [{
          text: message,
          sender: 'customer',
          senderName: name,
        }],
        lastMessageAt: Date.now(),
      });
    }

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact messages/conversations
// @route   GET /api/contact-messages
// @access  Private/Admin
export const getContactMessages = async (req, res) => {
  try {
    const { status, isRead } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const conversations = await ContactMessage.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's own conversation
// @route   GET /api/contact-messages/my-conversation
// @access  Private (logged-in users)
export const getMyConversation = async (req, res) => {
  try {
    // Find conversation by email or userId (for conversations created while logged in)
    const conversation = await ContactMessage.findOne({
      $or: [
        { email: req.user.email },
        { userId: req.user._id }
      ],
      status: 'active'
    }).sort({ lastMessageAt: -1 });

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact conversations
// @route   GET /api/contact-messages/:id
// @access  Private/Admin
export const getContactMessageById = async (req, res) => {
  try {
    const conversation = await ContactMessage.findById(req.params.id)
      .populate('userId', 'firstName lastName email profileImage');

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark message as read
// @route   PATCH /api/contact-messages/:id/read
// @access  Private/Admin
export const markMessageAsRead = async (req, res) => {
  try {
    const message = await ContactMessage.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    message.isRead = true;
    await message.save();

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Respond to contact message (Add admin message to conversation)
// @route   POST /api/contact-messages/:id/respond
// @access  Private/Admin
export const respondToMessage = async (req, res) => {
  try {
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({ message: 'Response text is required' });
    }

    const conversation = await ContactMessage.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Add admin message to conversation
    conversation.messages.push({
      text: response,
      sender: 'admin',
      senderName: `${req.user.firstName} ${req.user.lastName}`,
    });
    conversation.lastMessageAt = Date.now();
    conversation.isRead = true;

    await conversation.save();

    const updatedConversation = await ContactMessage.findById(req.params.id)
      .populate('userId', 'firstName lastName email');

    res.json({
      success: true,
      data: updatedConversation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update conversation status
// @route   PATCH /api/contact-messages/:id/status
// @access  Private/Admin
export const updateMessageStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['active', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be "active" or "closed"' });
    }

    const conversation = await ContactMessage.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    conversation.status = status;
    await conversation.save();

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact-messages/:id
// @access  Private/Admin
export const deleteContactMessage = async (req, res) => {
  try {
    const conversation = await ContactMessage.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    await ContactMessage.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Conversation deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get conversation by ID (for guests)
// @route   GET /api/contact-messages/public/:id
// @access  Public
export const getPublicConversation = async (req, res) => {
  try {
    const conversation = await ContactMessage.findById(req.params.id);

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get unread messages count
// @route   GET /api/contact-messages/unread/count
// @access  Private/Admin
export const getUnreadCount = async (req, res) => {
  try {
    const count = await ContactMessage.countDocuments({ isRead: false });

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
