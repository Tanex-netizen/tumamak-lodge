import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from '../models/Room.js';

dotenv.config();

const checkRooms = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const rooms = await Room.find({}, 'roomNumber name capacity').sort({ roomNumber: 1 });
    
    if (rooms.length === 0) {
      console.log('No rooms found in database');
    } else {
      console.log('Rooms in database:');
      rooms.forEach(room => {
        console.log(`Room ${room.roomNumber}: ${room.name} - Capacity: ${room.capacity?.adults || 'N/A'} adults`);
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

checkRooms();
