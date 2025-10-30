import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import { differenceInDays } from 'date-fns';

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      guests,
      specialRequests,
      reservationFee,
      numberOfNights, // Actually 12-hour periods, sent from frontend
    } = req.body;

    // Check if room exists
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (!room.isAvailable) {
      return res.status(400).json({ message: 'Room is not available' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      room: roomId,
      status: { $nin: ['cancelled'] },
      $or: [
        {
          checkInDate: { $lte: checkOut },
          checkOutDate: { $gte: checkIn },
        },
      ],
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        message: 'Room is not available for the selected dates',
      });
    }

    // Validate dates
    if (checkOut <= checkIn) {
      return res.status(400).json({
        message: 'Check-out date must be after check-in date',
      });
    }

    // Calculate based on 12-hour periods if not provided
    const periods = numberOfNights || Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 12));
    
    // Calculate amounts
    const roomPrice = room.price * periods;
    const reservationFeeAmount = reservationFee || Math.round(roomPrice * 0.12);
    const totalAmount = roomPrice + reservationFeeAmount;

    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests,
      numberOfNights: periods, // Store as periods
      roomPrice,
      reservationFee: reservationFeeAmount,
      totalAmount,
      specialRequests,
      status: 'pending',
      paymentStatus: 'unpaid', // Payment on arrival
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('room', 'name roomNumber images price floor')
      .populate('user', 'firstName lastName email phone');

    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room', 'name roomNumber images price floor')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const { status, paymentStatus, startDate, endDate } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    if (startDate || endDate) {
      query.checkIn = {};
      if (startDate) query.checkIn.$gte = new Date(startDate);
      if (endDate) query.checkIn.$lte = new Date(endDate);
    }

    const bookings = await Booking.find(query)
      .populate('user', 'firstName lastName email phone profileImage')
      .populate('room', 'name roomNumber floor price')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'firstName lastName email phone profileImage address')
      .populate('room', 'name roomNumber floor price images amenities type');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin' &&
      req.user.role !== 'staff'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.status = status;
    if (notes) booking.notes = notes;

    const updatedBooking = await booking.save();

    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('user', 'firstName lastName email phone profileImage')
      .populate('room', 'name roomNumber floor price');

    res.json({ success: true, data: populatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update payment status
// @route   PUT /api/bookings/:id/payment
// @access  Private/Admin
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    booking.paymentStatus = paymentStatus;

    const updatedBooking = await booking.save();

    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('user', 'firstName lastName email phone profileImage')
      .populate('room', 'name roomNumber floor price');

    res.json({ success: true, data: populatedBooking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const { cancellationReason } = req.body;

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check if user owns this booking or is admin
    if (
      booking.user.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    if (booking.status === 'checked-out') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancellationReason = cancellationReason;

    const updatedBooking = await booking.save();

    const populatedBooking = await Booking.findById(updatedBooking._id)
      .populate('user', 'firstName lastName email phone')
      .populate('room', 'name roomNumber floor price');

    res.json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private/Admin
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create walk-in booking (for admin)
// @route   POST /api/bookings/walk-in
// @access  Private/Admin
export const createWalkInBooking = async (req, res) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      guestName,
      guestPhone,
      guests,
      notes,
    } = req.body;

    // Check if room exists
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Check for overlapping bookings
    const overlappingBookings = await Booking.find({
      room: roomId,
      status: { $nin: ['cancelled'] },
      $or: [
        {
          checkInDate: { $lte: checkOut },
          checkOutDate: { $gte: checkIn },
        },
      ],
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({
        message: 'Room is not available for the selected dates',
      });
    }

    // Calculate nights
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    // Create walk-in booking
    const booking = await Booking.create({
      user: req.user._id, // The admin creating the booking
      room: roomId,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: {
        adults: guests || 1,
        children: 0,
      },
      specialRequests: notes || '',
      numberOfNights: nights,
      roomPrice: 0, // No revenue
      reservationFee: 0, // No revenue
      totalAmount: 0, // No revenue
      status: 'confirmed', // Walk-ins are pre-confirmed
      paymentStatus: 'walk-in', // Special status for walk-ins
      guestName: guestName, // Store guest name for walk-ins
      guestPhone: guestPhone, // Store guest phone for walk-ins
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('room')
      .populate('user', 'firstName lastName email');

    res.status(201).json({
      success: true,
      data: populatedBooking,
      message: 'Walk-in booking created successfully',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booked dates for a room
// @route   GET /api/bookings/room/:roomId/booked-dates
// @access  Public
export const getBookedDatesForRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Find all bookings that are confirmed/completed (red slash appears after customer confirms booking)
    // Exclude: cancelled bookings only
    // Include: pending, confirmed, checked-in, checked-out (all show red slash)
    const bookings = await Booking.find({
      room: roomId,
      status: { $ne: 'cancelled' }, // Only exclude cancelled bookings
    }).select('checkInDate checkOutDate');

    // Generate array of all booked dates
    const bookedDates = [];
    bookings.forEach((booking) => {
      const start = new Date(booking.checkInDate);
      const end = new Date(booking.checkOutDate);
      
      // Add all dates between check-in and check-out (inclusive)
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        bookedDates.push(new Date(date).toISOString().split('T')[0]); // Format: YYYY-MM-DD
      }
    });

    // Remove duplicates
    const uniqueBookedDates = [...new Set(bookedDates)];

    res.json({ 
      success: true, 
      data: uniqueBookedDates 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
