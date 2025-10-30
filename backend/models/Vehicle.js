import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vehicle name is required'],
    },
    type: {
      type: String,
      required: [true, 'Vehicle type is required'],
      enum: ['Car', 'Van', 'SUV', 'Motorcycle', 'Bicycle', 'Other'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
    },
    images: [
      {
        url: String,
        public_id: String,
      },
    ],
    features: [
      {
        type: String,
      },
    ],
    isAvailable: {
      type: Boolean,
      default: true,
    },
    transmissionType: {
      type: String,
      enum: ['Manual', 'Automatic'],
    },
    fuelType: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;
