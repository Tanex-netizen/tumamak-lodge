import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryHelper.js';

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res) => {
  try {
    const { floor, minPrice, maxPrice, capacity } = req.query;

    let query = {};

    if (floor) {
      query.floor = floor;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (capacity) {
      query['capacity.adults'] = { $gte: Number(capacity) };
    }

    const rooms = await Room.find(query).sort({ roomNumber: 1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Get reviews for this room
    const reviews = await Review.find({ room: req.params.id, isApproved: true })
      .populate('user', 'firstName lastName profileImage')
      .sort({ createdAt: -1 });

    res.json({ room, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check room availability
// @route   POST /api/rooms/check-availability
// @access  Public
export const checkAvailability = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Find overlapping bookings
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

    const isAvailable = overlappingBookings.length === 0;

    res.json({
      isAvailable,
      bookedDates: overlappingBookings.map((booking) => ({
        checkIn: booking.checkInDate,
        checkOut: booking.checkOutDate,
      })),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get booked dates for a room
// @route   GET /api/rooms/:id/booked-dates
// @access  Public
export const getBookedDates = async (req, res) => {
  try {
    const bookings = await Booking.find({
      room: req.params.id,
      status: { $nin: ['cancelled'] },
      checkOutDate: { $gte: new Date() },
    }).select('checkInDate checkOutDate');

    const bookedDates = bookings.map((booking) => ({
      start: booking.checkInDate,
      end: booking.checkOutDate,
    }));

    res.json(bookedDates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      name,
      floor,
      description,
      price,
      capacity,
      amenities,
      size,
      bedType,
    } = req.body;

    // Check if room number already exists
    const roomExists = await Room.findOne({ roomNumber });

    if (roomExists) {
      return res.status(400).json({ message: 'Room number already exists' });
    }

    // Handle multiple image uploads
    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file.buffer,
          'tumamak-lodge/rooms'
        );
        images.push(result);
      }
    }

    const room = await Room.create({
      roomNumber,
      name,
      floor,
      description,
      price,
      capacity,
      images,
      amenities,
      size,
      bedType,
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const {
      roomNumber,
      name,
      floor,
      description,
      price,
      capacity,
      amenities,
      size,
      bedType,
      isAvailable,
    } = req.body;

    // Update fields
    if (roomNumber) room.roomNumber = roomNumber;
    if (name) room.name = name;
    if (floor) room.floor = floor;
    if (description) room.description = description;
    if (price) room.price = price;
    if (capacity) room.capacity = capacity;
    if (amenities) room.amenities = amenities;
    if (size) room.size = size;
    if (bedType) room.bedType = bedType;
    if (typeof isAvailable !== 'undefined') room.isAvailable = isAvailable;

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(
          file.buffer,
          'tumamak-lodge/rooms'
        );
        newImages.push(result);
      }
      room.images = [...room.images, ...newImages];
    }

    const updatedRoom = await room.save();
    res.json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a room image
// @route   DELETE /api/rooms/:id/images/:publicId
// @access  Private/Admin
export const deleteRoomImage = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const publicId = req.params.publicId;

    // Remove image from room
    room.images = room.images.filter((img) => img.public_id !== publicId);

    // Delete from cloudinary
    await deleteFromCloudinary(publicId);

    await room.save();
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Check if there are any active bookings
    const activeBookings = await Booking.find({
      room: req.params.id,
      status: { $in: ['pending', 'confirmed', 'checked-in'] },
    });

    if (activeBookings.length > 0) {
      return res.status(400).json({
        message: 'Cannot delete room with active bookings',
      });
    }

    // Delete images from cloudinary
    for (const image of room.images) {
      await deleteFromCloudinary(image.public_id);
    }

    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: 'Room deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
