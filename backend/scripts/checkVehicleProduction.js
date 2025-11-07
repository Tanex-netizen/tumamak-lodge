import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from '../models/Vehicle.js';

dotenv.config();

const MONGODB_URI = process.argv[2] || process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Usage: node checkVehicleProduction.js "<MONGODB_URI>"');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB (production)');

    const v = await Vehicle.findOne({ name: 'Yamaha Fazzio' }).lean();
    if (!v) {
      console.log('Yamaha Fazzio not found in production DB');
    } else {
      console.log('Yamaha Fazzio (production) record:');
      console.log(JSON.stringify(v, null, 2));
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
};

run();
