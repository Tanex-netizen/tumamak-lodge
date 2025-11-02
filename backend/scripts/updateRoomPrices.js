import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Room from '../models/Room.js';

dotenv.config();

const updateRoomPrices = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected...');

    // Define price updates
    const priceUpdates = {
      'Room 3': 500,
      'Room 6': 700,
      'Room 7': 800,
      'Room 10': 1600,
      'Room 11': 1600,
      'Room 12': 1300,
      'Room 13': 1300,
      'Room 14': 1300,
      'Room 15': 1800,
    };

    // Update upstairs amenities (Rooms 9-16)
    const upstairsAmenities = [
      'Air Conditioning',
      'Generator',
      'Free WiFi',
      'Soap',
      'Shampoo',
      'Toothbrush',
      'Toothpaste',
      'Towel',
    ];

    console.log('\n📝 Updating room prices...');
    
    // Update prices
    for (const [roomName, newPrice] of Object.entries(priceUpdates)) {
      const room = await Room.findOne({ name: roomName });
      if (room) {
        const oldPrice = room.price;
        room.price = newPrice;
        await room.save();
        console.log(`✓ ${roomName}: ₱${oldPrice} → ₱${newPrice}`);
      } else {
        console.log(`✗ ${roomName}: Not found`);
      }
    }

    console.log('\n🎁 Updating upstairs amenities...');
    
    // Update upstairs amenities (Rooms 9-16)
    for (let i = 9; i <= 16; i++) {
      const room = await Room.findOne({ name: `Room ${i}` });
      if (room) {
        room.amenities = upstairsAmenities;
        await room.save();
        console.log(`✓ Room ${i}: Amenities updated (added free WiFi, toiletries, towel)`);
      }
    }

    console.log('\n✅ All updates completed successfully!');
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('❌ Error updating rooms:', error);
    process.exit(1);
  }
};

updateRoomPrices();
