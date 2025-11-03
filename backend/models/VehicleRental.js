import mongoose from 'mongoose';

const vehicleRentalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    rentalNumber: {
      type: String,
      unique: true,
    },
    pickupDate: {
      type: Date,
      required: [true, 'Pickup date is required'],
    },
    returnDate: {
      type: Date,
      required: [true, 'Return date is required'],
    },
    rentalDays: {
      type: Number,
      required: true,
    },
    dailyRate: {
      type: Number,
      required: true,
    },
    rentalCost: {
      type: Number,
      required: true,
    },
    reservationFee: {
      type: Number,
      default: 0,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'deposit-paid', 'fully-paid', 'refunded'],
      default: 'unpaid',
    },
    contactInfo: {
      fullName: String,
      email: String,
      phone: String,
      address: String,
      licenseNumber: String,
      emergencyContact: String,
      emergencyPhone: String,
    },
    specialRequests: {
      type: String,
    },
    pickupLocation: {
      type: String,
      default: 'Tumamak Lodge',
    },
    returnLocation: {
      type: String,
      default: 'Tumamak Lodge',
    },
    actualPickupDate: Date,
    actualReturnDate: Date,
    damageReport: String,
    fuelLevel: {
      pickup: String,
      return: String,
    },
    notes: String,
  },
  {
    timestamps: true,
  }
);

// Generate unique rental number before saving
vehicleRentalSchema.pre('save', async function (next) {
  if (!this.rentalNumber) {
    const count = await mongoose.models.VehicleRental.countDocuments();
    this.rentalNumber = `VR${Date.now()}${count + 1}`;
  }
  next();
});

const VehicleRental = mongoose.model('VehicleRental', vehicleRentalSchema);

export default VehicleRental;
