import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Gallery from '../models/Gallery.js';

dotenv.config();

const galleryImages = [
  // Rooms
  {
    title: 'Deluxe Room Interior',
    description: 'Spacious and elegant deluxe room with modern amenities',
    category: 'rooms',
    image: {
      url: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800',
      public_id: 'deluxe_room_1',
    },
  },
  {
    title: 'Standard Room',
    description: 'Cozy standard room perfect for solo travelers',
    category: 'rooms',
    image: {
      url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
      public_id: 'standard_room_1',
    },
  },
  {
    title: 'Suite Bedroom',
    description: 'Luxurious suite with king-size bed',
    category: 'rooms',
    image: {
      url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      public_id: 'suite_room_1',
    },
  },
  {
    title: 'Room with View',
    description: 'Beautiful mountain view from the room',
    category: 'rooms',
    image: {
      url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800',
      public_id: 'room_view_1',
    },
  },

  // Facilities
  {
    title: 'Swimming Pool',
    description: 'Infinity pool with stunning views',
    category: 'facilities',
    image: {
      url: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800',
      public_id: 'pool_1',
    },
  },
  {
    title: 'Spa & Wellness Center',
    description: 'Relax and rejuvenate at our spa',
    category: 'facilities',
    image: {
      url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
      public_id: 'spa_1',
    },
  },
  {
    title: 'Fitness Center',
    description: 'State-of-the-art gym equipment',
    category: 'facilities',
    image: {
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800',
      public_id: 'gym_1',
    },
  },
  {
    title: 'Conference Room',
    description: 'Professional meeting space',
    category: 'facilities',
    image: {
      url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
      public_id: 'conference_1',
    },
  },

  // Dining
  {
    title: 'Restaurant Interior',
    description: 'Elegant dining atmosphere',
    category: 'dining',
    image: {
      url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      public_id: 'restaurant_1',
    },
  },
  {
    title: 'Breakfast Buffet',
    description: 'Fresh and delicious breakfast spread',
    category: 'dining',
    image: {
      url: 'https://images.unsplash.com/photo-1533920379810-6bedac961555?w=800',
      public_id: 'breakfast_1',
    },
  },
  {
    title: 'Fine Dining',
    description: 'Exquisite culinary experience',
    category: 'dining',
    image: {
      url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
      public_id: 'dining_1',
    },
  },
  {
    title: 'Bar Lounge',
    description: 'Relaxing bar with signature cocktails',
    category: 'dining',
    image: {
      url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800',
      public_id: 'bar_1',
    },
  },

  // Activities
  {
    title: 'Hiking Trails',
    description: 'Explore beautiful nature trails',
    category: 'activities',
    image: {
      url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      public_id: 'hiking_1',
    },
  },
  {
    title: 'Kayaking',
    description: 'Water sports and adventures',
    category: 'activities',
    image: {
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
      public_id: 'kayaking_1',
    },
  },
  {
    title: 'Yoga Sessions',
    description: 'Morning yoga with mountain views',
    category: 'activities',
    image: {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800',
      public_id: 'yoga_1',
    },
  },
  {
    title: 'Bonfire Night',
    description: 'Cozy evening gatherings',
    category: 'activities',
    image: {
      url: 'https://images.unsplash.com/photo-1476611317561-60117649dd94?w=800',
      public_id: 'bonfire_1',
    },
  },

  // Exterior & Nature
  {
    title: 'Lodge Exterior',
    description: 'Beautiful lodge architecture',
    category: 'exterior',
    image: {
      url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      public_id: 'exterior_1',
    },
  },
  {
    title: 'Mountain View',
    description: 'Breathtaking mountain scenery',
    category: 'exterior',
    image: {
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      public_id: 'mountain_1',
    },
  },
  {
    title: 'Sunset View',
    description: 'Beautiful sunset from the lodge',
    category: 'exterior',
    image: {
      url: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=800',
      public_id: 'sunset_1',
    },
  },
  {
    title: 'Garden Landscape',
    description: 'Lush gardens surrounding the property',
    category: 'exterior',
    image: {
      url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800',
      public_id: 'garden_1',
    },
  },
  {
    title: 'Forest Path',
    description: 'Peaceful walking trails',
    category: 'exterior',
    image: {
      url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      public_id: 'forest_1',
    },
  },
  {
    title: 'Lake View',
    description: 'Serene lake near the lodge',
    category: 'exterior',
    image: {
      url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800',
      public_id: 'lake_1',
    },
  },
];

const seedGallery = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected...');

    // Clear existing gallery images
    await Gallery.deleteMany({});
    console.log('Existing gallery images cleared');

    // Insert new gallery images
    const createdImages = await Gallery.insertMany(galleryImages);
    console.log(`${createdImages.length} gallery images seeded successfully`);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding gallery:', error);
    process.exit(1);
  }
};

seedGallery();
