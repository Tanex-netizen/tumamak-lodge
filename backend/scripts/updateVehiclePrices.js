import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from '../models/Vehicle.js';

dotenv.config();

const updateVehiclePrices = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected...');

    // Get all vehicles
    const vehicles = await Vehicle.find({});
    console.log(`Found ${vehicles.length} vehicles`);

    // Update each vehicle's price by subtracting 100
    for (const vehicle of vehicles) {
      const oldPrice = vehicle.pricePerDay;
      vehicle.pricePerDay = oldPrice - 100;
      await vehicle.save();
      console.log(`Updated ${vehicle.name}: ₱${oldPrice} → ₱${vehicle.pricePerDay}`);
    }

    console.log('All vehicle prices updated successfully!');
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error updating vehicle prices:', error);
    process.exit(1);
  }
};

updateVehiclePrices();
