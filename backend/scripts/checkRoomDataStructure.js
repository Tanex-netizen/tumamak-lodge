import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from '../models/Room.js';

dotenv.config();

const checkRoomDataStructure = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get Room 8 specifically
    const room8 = await Room.findOne({ roomNumber: 'G08' });
    
    console.log('=== ROOM 8 FULL DATA ===');
    console.log(JSON.stringify(room8, null, 2));
    
    console.log('\n=== CAPACITY FIELD ===');
    console.log('room8.capacity:', room8.capacity);
    console.log('room8.capacity.adults:', room8.capacity.adults);
    console.log('Type of capacity:', typeof room8.capacity);
    console.log('Type of adults:', typeof room8.capacity.adults);

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkRoomDataStructure();
