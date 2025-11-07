import mongoose from 'mongoose';
import Vehicle from '../models/Vehicle.js';

const MONGODB_URI = process.argv[2];
const IDENTIFIER = process.argv[3]; // vehicle name or public_id
const NEW_CAPACITY = Number(process.argv[4]);
const MODE = process.argv[5] || 'name'; // 'name' or 'public_id'

if (!MONGODB_URI || !IDENTIFIER || !NEW_CAPACITY) {
  console.error('Usage: node updateVehicleCapacityProduction.js <MONGODB_URI> <name|public_id> <newCapacity> [mode]');
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

    console.log('Before update:', {
      name: v.name,
      capacity: v.capacity,
      description: v.description,
      features: v.features
    });

    // Update capacity
    v.capacity = NEW_CAPACITY;

    // Attempt to update description if it contains a seater indicator or a 'seats' phrase
    if (v.description) {
      if (/\d+\s*-?seater/i.test(v.description)) {
        v.description = v.description.replace(/\d+\s*-?seater/i, `${NEW_CAPACITY}-seater`);
      }
      if (/\d+\s*seats?/i.test(v.description)) {
        v.description = v.description.replace(/\d+\s*seats?/i, `${NEW_CAPACITY} seats`);
      }
    }

    // Update features strings like '7 seats' -> '5 seats'
    if (Array.isArray(v.features)) {
      v.features = v.features.map((f) => {
        try {
          return String(f).replace(/\d+\s*seats?/i, `${NEW_CAPACITY} seats`);
        } catch (e) {
          return f;
        }
      });
    }

    v.updatedAt = new Date();
    await v.save();

    console.log('After update:', {
      name: v.name,
      capacity: v.capacity,
      description: v.description,
      features: v.features
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error updating vehicle capacity:', err.message);
    process.exit(1);
  }
};

run();
