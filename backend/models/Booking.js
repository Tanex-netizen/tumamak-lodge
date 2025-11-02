import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingNumber: {
      type: String,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
    },
    checkInDate: {
      type: Date,
      required: [true, 'Check-in date is required'],
    },
    checkOutDate: {
      type: Date,
      required: [true, 'Check-out date is required'],
    },
    guests: {
      adults: {
        type: Number,
        required: true,
        default: 1,
      },
      children: {
        type: Number,
        default: 0,
      },
    },
    numberOfNights: {
      type: Number,
      required: true,
    },
    roomPrice: {
      type: Number,
      required: true,
    },
    reservationFee: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled', 'hold'],
      default: 'pending',
    },
    holdExpiresAt: {
      type: Date,
      index: { expires: 0 }, // TTL index - auto-deletes documents when holdExpiresAt passes
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'reservation-paid', 'fully-paid', 'walk-in'],
      default: 'unpaid',
    },
    guestName: {
      type: String,
      // For walk-in bookings, store guest name
    },
    guestPhone: {
      type: String,
      // For walk-in bookings, store guest phone
    },
    specialRequests: {
      type: String,
    },
    notes: {
      type: String, // Admin notes
    },
    cancelledAt: {
      type: Date,
    },
    cancellationReason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Generate unique booking number before saving
bookingSchema.pre('save', async function (next) {
  if (!this.bookingNumber) {
    const count = await mongoose.model('Booking').countDocuments();
    this.bookingNumber = `BK${Date.now()}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
