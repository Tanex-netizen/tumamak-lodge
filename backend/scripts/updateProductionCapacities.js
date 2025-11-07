import mongoose from 'mongoose';
import Room from '../models/Room.js';

// Get MongoDB URI from command line argument or environment variable
const MONGODB_URI = process.argv[2] || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('ERROR: No MongoDB URI provided!');
  console.log('Usage: node updateProductionCapacities.js "mongodb+srv://your-connection-string"');
  process.exit(1);
}

const updateRoomCapacities = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✓ Connected to MongoDB\n');

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

    console.log('Updating room capacities in PRODUCTION database...\n');

    let updated = 0;
    let notFound = 0;

    for (const [roomNumber, capacity] of Object.entries(capacityMap)) {
      const result = await Room.updateOne(
        { roomNumber: roomNumber },
        { 
          $set: { 
            'capacity.adults': capacity,
            'capacity.children': 0
          } 
        }
      );

      if (result.matchedCount > 0) {
        console.log(`✓ Room ${roomNumber}: Updated capacity to ${capacity} persons`);
        updated++;
      } else {
        console.log(`✗ Room ${roomNumber}: Not found in database`);
        notFound++;
      }
    }

    console.log(`\n=== SUMMARY ===`);
    console.log(`✓ Updated: ${updated} rooms`);
    console.log(`✗ Not found: ${notFound} rooms`);
    console.log('\n✅ Done! Room capacities updated in production database!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating room capacities:', error.message);
    process.exit(1);
  }
};

updateRoomCapacities();
