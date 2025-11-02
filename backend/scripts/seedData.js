import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import User from '../models/User.js';
import Room from '../models/Room.js';
import Homepage from '../models/Homepage.js';
import connectDB from '../config/db.js';

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Room.deleteMany();
    await Homepage.deleteMany();

    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin',
      password: 'lodgebooking@12345',
      phone: '+1234567890',
      role: 'admin',
    });

    console.log('Admin user created');

  // Helper: read available image files for a room from repo images folder
  // images folder is located at repository root `/images/room images`
  // when running scripts from backend/ the repo root is one level up
  const imagesDir = path.join(process.cwd(), '..', 'images', 'room images');

  const getImagesForRoom = (roomNumber) => {
    const files = [];
    // check up to 5 variants: base, (2), (3), (4), (5)
    const variants = ["", "(2)", "(3)", "(4)", "(5)"];
    for (const v of variants) {
      const filename = `room${roomNumber}${v}.jpg`;
      const filePath = path.join(imagesDir, filename);
      if (fs.existsSync(filePath)) {
        // Use encodeURI for URL path (handles spaces)
        files.push({ url: encodeURI(`/images/room images/${filename}`), public_id: null });
      }
    }
    return files;
  };

  // Create sample rooms
// Ground Floor: Rooms 1-8 with prices per 12 hours
const groundFloorPrices = [500, 500, 500, 500, 500, 700, 800, 1600];
const groundFloorRooms = [];

for (let i = 1; i <= 8; i++) {
  let amenities = [];

  if (i >= 1 && i <= 5) {
    amenities = ['Fan', 'Generator']; // Rooms 1–5
  } else if (i === 6) {
    amenities = ['Air Conditioning', 'Generator']; // Room 6
  } else if (i === 7 || i === 8) {
    amenities = ['Air Conditioning', 'Generator', 'Private Bathroom']; // Rooms 7–8
  }

  const gfImages = getImagesForRoom(i);
  const gfThumbnail = gfImages.length > 0 ? gfImages[0].url : null;

  groundFloorRooms.push({
    roomNumber: `G${String(i).padStart(2, '0')}`,
    name: `Room ${i}`,
    floor: 'Ground Floor',
    description: `Comfortable and cozy ground floor room with modern amenities.`,
    price: groundFloorPrices[i - 1],
    capacity: {
      adults: 2,
      children: 1,
    },
    amenities,
    size: '25 sqm',
    bedType: i % 2 === 0 ? 'Queen Bed' : 'Twin Beds',
    images: gfImages,
    thumbnail: gfThumbnail,
  });
}


    // Upstairs: Rooms 9-16 with prices per 12 hours
    const upstairsPrices = [2200, 1600, 1600, 1300, 1300, 1300, 1800, 1700];
    const upstairsRooms = [];
    
    for (let i = 1; i <= 8; i++) {
      // Upstairs rooms (Rooms 9-16) all include Air Conditioning + Generator + Free amenities
      const amenities = [
        'Air Conditioning',
        'Generator',
        'Free WiFi',
        'Soap',
        'Shampoo',
        'Toothbrush',
        'Toothpaste',
        'Towel',
      ];

      const upNum = i + 8; // actual room number
      const upImages = getImagesForRoom(upNum);
      const upThumbnail = upImages.length > 0 ? upImages[0].url : null;

      upstairsRooms.push({
        roomNumber: `U${String(i).padStart(2, '0')}`,
        name: `Room ${i + 8}`,
        floor: 'Upstairs',
        description: `Spacious upstairs room with beautiful views and premium amenities. Enjoy your stay with comfort and style.`,
        price: upstairsPrices[i - 1],
        capacity: {
          adults: 2,
          children: 2,
        },
        amenities,
        size: '30 sqm',
        bedType: i % 2 === 0 ? 'King Bed' : 'Queen Bed',
        // Upstairs room number (human) is i + 8
        images: upImages,
        thumbnail: upThumbnail,
      });
    }

    // Fix missing images for room 13 and 16 by copying from nearby rooms if needed
    // Room 13 now has its own images, so we only fallback for room 16
    const fixFallbackImages = (roomsArray) => {
      // roomsArray is array of room objects just created in memory (groundFloorRooms + upstairsRooms will be merged later)
      // Find room 16 in combined list
      return roomsArray.map((r) => {
        const num = parseInt(r.name.replace(/[^0-9]/g, ''), 10);
        // Room 13 now has images (room13.jpg, room13(2).jpg, room13(3).jpg), no fallback needed
        if (num === 16 && (!r.images || r.images.length === 0)) {
          const imgs = getImagesForRoom(15);
          if (imgs.length > 0) {
            r.images = imgs;
            r.thumbnail = imgs[0].url;
          }
        }
        return r;
      });
    };

  const roomsToInsert = fixFallbackImages([...groundFloorRooms, ...upstairsRooms]);
  await Room.insertMany(roomsToInsert);

    console.log('Sample rooms created');

    // Create homepage content
    await Homepage.create([
      {
        section: 'hero',
        content: {
          title: 'Tumamak Lodge',
          subtitle: 'Find Comfort in a Foreign Land',
          description: 'Experience the perfect blend of comfort and hospitality',
        },
      },
      {
        section: 'about',
        content: {
          title: 'About Us',
          description:
            'Welcome to Tumamak Lodge, where comfort meets nature. Our lodge offers a serene and welcoming environment for travelers seeking a peaceful retreat. With modern amenities and traditional hospitality, we ensure your stay is memorable and comfortable.',
        },
      },
      {
        section: 'contact',
        content: {
          address: '123 Mountain Road, Lodge Valley',
          phone: '+1234567890',
          email: 'info@tumamaklodge.com',
          hours: 'Monday - Sunday: 24/7',
        },
      },
    ]);

    console.log('Homepage content created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\nAdmin credentials:');
    console.log('Email: admin');
    console.log('Password: lodgebooking@12345');

    // Don't exit if called as module
    if (import.meta.url === `file://${process.argv[1]}`) {
      process.exit();
    }
  } catch (error) {
    console.error('Error seeding database:', error);
    if (import.meta.url === `file://${process.argv[1]}`) {
      process.exit(1);
    }
    throw error;
  }
};

// Run seed if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedData();
}

export default seedData;
