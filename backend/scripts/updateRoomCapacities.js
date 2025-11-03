import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from '../models/Room.js';

dotenv.config();

const updateRoomCapacities = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Room capacity mapping based on room numbers
    const capacityMap = {
      // 2 persons capacity - Ground Floor rooms (1-7) and Upstairs rooms (9, 12, 13, 14, 16)
      'G01': 2, 'G02': 2, 'G03': 2, 'G04': 2, 'G05': 2, 'G06': 2, 'G07': 2,
      'U01': 2, 'U04': 2, 'U05': 2, 'U06': 2, 'U08': 2,
      
      // 4 persons capacity - Room 8
      'G08': 4,
      
      // 3 persons capacity - Rooms 10, 11, 15
      'U02': 3, 'U03': 3, 'U07': 3,
    };

    console.log('\nUpdating room capacities...\n');

    for (const [roomNumber, capacity] of Object.entries(capacityMap)) {
      const result = await Room.updateOne(
        { roomNumber: roomNumber },
        { 
          $set: { 
            'capacity.adults': capacity,
            'capacity.children': 0 // Set children to 0 as you only specified adults
          } 
        }
      );

      if (result.matchedCount > 0) {
        console.log(`✓ Room ${roomNumber}: Updated capacity to ${capacity} persons`);
      } else {
        console.log(`✗ Room ${roomNumber}: Not found in database`);
      }
    }

    console.log('\n✅ Room capacities updated successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating room capacities:', error);
    process.exit(1);
  }
};

updateRoomCapacities();
