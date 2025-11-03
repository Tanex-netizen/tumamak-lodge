import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from '../models/Room.js';

dotenv.config();

const testRoomCapacity = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Get a few specific rooms to test
    const testRooms = ['G08', 'U02', 'U03', 'U07', 'G01'];
    
    console.log('Testing room capacity data:\n');
    
    for (const roomNumber of testRooms) {
      const room = await Room.findOne({ roomNumber });
      if (room) {
        console.log(`${room.name} (${roomNumber}):`);
        console.log(`  Capacity: ${room.capacity?.adults || 'N/A'} adults`);
        console.log(`  Full capacity object:`, JSON.stringify(room.capacity));
        console.log('');
      }
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testRoomCapacity();
