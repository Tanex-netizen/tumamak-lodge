import mongoose from 'mongoose';
import Vehicle from '../models/Vehicle.js';

const MONGODB_URI = process.argv[2];
const IDENTIFIER = process.argv[3]; // vehicle name or public_id
const NEW_PRICE = Number(process.argv[4]);
const MODE = process.argv[5] || 'name'; // 'name' or 'public_id'

if (!MONGODB_URI || !IDENTIFIER || !NEW_PRICE) {
  console.error('Usage: node updateVehiclePriceProduction.js <MONGODB_URI> <name|public_id> <newPrice> [mode]');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to production DB');

    let filter = {};
    if (MODE === 'public_id') {
      filter = { 'images.public_id': IDENTIFIER };
    } else {
      filter = { name: IDENTIFIER };
    }

    const v = await Vehicle.findOne(filter);
    if (!v) {
      console.error('Vehicle not found with filter:', filter);
      process.exit(1);
    }

    console.log('Before update:', { name: v.name, pricePerDay: v.pricePerDay });

    v.pricePerDay = NEW_PRICE;
    v.updatedAt = new Date();
    await v.save();

    console.log('After update:', { name: v.name, pricePerDay: v.pricePerDay });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error updating vehicle price:', err.message);
    process.exit(1);
  }
};

run();
