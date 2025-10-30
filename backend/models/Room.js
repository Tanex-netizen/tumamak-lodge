import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Room name is required'],
    },
    floor: {
      type: String,
      enum: ['Ground Floor', 'Upstairs'],
      required: [true, 'Floor is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    capacity: {
      adults: {
        type: Number,
        required: true,
        default: 2,
      },
      children: {
        type: Number,
        required: true,
        default: 1,
      },
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    thumbnail: {
      type: String,
    },
    amenities: [
      {
        type: String,
      },
    ],
    size: {
      type: String, // e.g., "25 sqm"
    },
    bedType: {
      type: String, // e.g., "Queen Bed", "Twin Beds"
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Room = mongoose.model('Room', roomSchema);

export default Room;
