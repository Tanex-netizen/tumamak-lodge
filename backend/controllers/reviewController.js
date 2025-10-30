import Review from '../models/Review.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { roomId, bookingId, rating, comment } = req.body;

    // Check if booking exists and belongs to user
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if booking is completed
    if (booking.status !== 'checked-out') {
      return res.status(400).json({
        message: 'You can only review after your stay is completed',
      });
    }

    // Check if user already reviewed this booking
    const existingReview = await Review.findOne({
      user: req.user._id,
      booking: bookingId,
    });

    if (existingReview) {
      return res.status(400).json({
        message: 'You have already reviewed this booking',
      });
    }

    const review = await Review.create({
      user: req.user._id,
      room: roomId,
      booking: bookingId,
      rating,
      comment,
    });

    // Update room average rating
    await updateRoomRating(roomId);

    const populatedReview = await Review.findById(review._id).populate(
      'user',
      'firstName lastName profileImage'
    );

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a room
// @route   GET /api/reviews/room/:roomId
// @access  Public
export const getRoomReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      room: req.params.roomId,
      isApproved: true,
    })
      .populate('user', 'firstName lastName profileImage')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private/Admin
export const getAllReviews = async (req, res) => {
  try {
    const { isApproved } = req.query;

    let query = {};

    if (typeof isApproved !== 'undefined') {
      query.isApproved = isApproved === 'true';
    }

    const reviews = await Review.find(query)
      .populate('user', 'firstName lastName email profileImage')
      .populate('room', 'name roomNumber')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update review approval
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
export const updateReviewApproval = async (req, res) => {
  try {
    const { isApproved } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.isApproved = isApproved;
    await review.save();

    // Update room rating
    await updateRoomRating(review.room);

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const roomId = review.room;

    await Review.findByIdAndDelete(req.params.id);

    // Update room rating
    await updateRoomRating(roomId);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to update room rating
const updateRoomRating = async (roomId) => {
  const reviews = await Review.find({ room: roomId, isApproved: true });

  const room = await Room.findById(roomId);

  if (room) {
    room.totalReviews = reviews.length;

    if (reviews.length > 0) {
      const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
      room.averageRating = totalRating / reviews.length;
    } else {
      room.averageRating = 0;
    }

    await room.save();
  }
};
