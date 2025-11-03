import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from '../models/Vehicle.js';

dotenv.config();

const vehicles = [
  {
    name: 'Honda Beat',
    type: 'Motorcycle',
    description: '125cc scooter • 2 helmets. Perfect for city riding and easy maneuverability.',
    pricePerDay: 350,
    capacity: 2,
    images: [
      {
        url: 'https://motortrade.com.ph/wp-content/uploads/2018/09/HONDA-BEAT-110-STREET-STD-1.jpg',
        public_id: 'honda_beat_1'
      }
    ],
    features: ['2 helmets', 'Under-seat storage', 'Fuel efficient', 'Easy to ride'],
    isAvailable: true,
    transmissionType: 'Automatic',
    fuelType: 'Gasoline'
  },
  {
    name: 'Yamaha Mio Gear',
    type: 'Motorcycle',
    description: '125cc scooter • 2 helmets. Sporty design with excellent performance.',
    pricePerDay: 350,
    capacity: 2,
    images: [
      {
        url: 'https://motortrade.com.ph/wp-content/uploads/2021/01/2-3.jpg',
        public_id: 'yamaha_mio_1'
      }
    ],
    features: ['2 helmets', 'Sporty design', 'LED lights', 'Digital display'],
    isAvailable: true,
    transmissionType: 'Automatic',
    fuelType: 'Gasoline'
  },
  {
    name: 'Honda Click',
    type: 'Motorcycle',
    description: '125cc scooter • 2 helmets. Stylish and comfortable for daily rides.',
    pricePerDay: 450,
    capacity: 2,
    images: [
      {
        url: 'https://motortrade.com.ph/wp-content/uploads/2020/08/CLICK-125i-SE-3.jpg',
        public_id: 'honda_click_1'
      }
    ],
    features: ['2 helmets', 'Comfortable seat', 'Spacious storage', 'Smooth ride'],
    isAvailable: true,
    transmissionType: 'Automatic',
    fuelType: 'Gasoline'
  },
  {
    name: 'Yamaha Fazzio',
    type: 'Motorcycle',
    description: '125cc scooter • 2 helmets. Modern design with advanced features.',
    pricePerDay: 550,
    capacity: 2,
    images: [
      {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRuWZxfVRHCPPi4t9ITwJ41HS1RsSS7m8b2g&s',
        public_id: 'yamaha_fazzio_1'
      }
    ],
    features: ['2 helmets', 'Smart key system', 'USB charging', 'LED lights'],
    isAvailable: true,
    transmissionType: 'Automatic',
    fuelType: 'Gasoline'
  },
  {
    name: 'Yamaha NMAX',
    type: 'Motorcycle',
    description: '155cc scooter • 2 helmets. Premium scooter with superior comfort.',
    pricePerDay: 700,
    capacity: 2,
    images: [
      {
        url: 'https://d1hv7ee95zft1i.cloudfront.net/custom/motorcycle-model-photo/original/2025-yamaha-nmax-tech-max-67d9694f162e7.jpeg',
        public_id: 'yamaha_nmax_1'
      }
    ],
    features: ['2 helmets', 'ABS brakes', 'Large storage', 'Premium comfort', 'Digital display'],
    isAvailable: true,
    transmissionType: 'Automatic',
    fuelType: 'Gasoline'
  },
  {
    name: 'Yamaha Aerox',
    type: 'Motorcycle',
    description: '155cc scooter • 2 helmets. Sporty performance scooter for thrill-seekers.',
    pricePerDay: 700,
    capacity: 2,
    images: [
      {
        url: 'https://motortrade.com.ph/wp-content/uploads/2021/02/MIO-AEROX-BRW6-MBL-1.jpg',
        public_id: 'yamaha_aerox_1'
      }
    ],
    features: ['2 helmets', 'Sport mode', 'Traction control', 'LED headlights', 'Digital panel'],
    isAvailable: true,
    transmissionType: 'Automatic',
    fuelType: 'Gasoline'
  },
  {
    name: 'Stingray Wagon R',
    type: 'Car',
    description: '7-seater / 7 seats. Compact and fuel-efficient family wagon.',
    pricePerDay: 1400,
    capacity: 7,
    images: [
      {
        url: 'https://www.carfolio.com/images/dbimages/zgas/models/id/26598/suzuki%20wagonr%20stingray%20front%2034%202.jpg',
        public_id: 'stingray_wagon_1'
      }
    ],
    features: ['7 seats', 'Air conditioning', 'Power steering', 'Fuel efficient', 'Spacious interior'],
    isAvailable: true,
    transmissionType: 'Manual',
    fuelType: 'Gasoline'
  },
  {
    name: 'Suzuki S-Presso',
    type: 'SUV',
    description: 'Compact T-seater • 5 seats. Mini SUV with great fuel economy.',
    pricePerDay: 1800,
    capacity: 5,
    images: [
      {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSsi1kVDWtSGnQsP-AZ7QpG5sA8KzkMK_dMPg&s',
        public_id: 'suzuki_spresso_1'
      }
    ],
    features: ['5 seats', 'Air conditioning', 'Power windows', 'Bluetooth', 'Compact SUV design'],
    isAvailable: true,
    transmissionType: 'Manual',
    fuelType: 'Gasoline'
  },
  {
    name: 'Mitsubishi Xpander',
    type: 'Van',
    description: 'MPV 7-seater • 7 seats. Spacious and comfortable for families.',
    pricePerDay: 2500,
    capacity: 7,
    images: [
      {
        url: 'https://www.group1mitsubishi.co.za/wp-content/uploads/xpander-white.jpg',
        public_id: 'mitsubishi_xpander_1'
      }
    ],
    features: ['7 seats', 'Air conditioning', 'Entertainment system', 'Spacious cargo', 'Family friendly'],
    isAvailable: true,
    transmissionType: 'Automatic',
    fuelType: 'Gasoline'
  }
];

const seedVehicles = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected...');

    // Clear existing vehicles
    await Vehicle.deleteMany({});
    console.log('Existing vehicles cleared');

    // Insert new vehicles
    const createdVehicles = await Vehicle.insertMany(vehicles);
    console.log(`${createdVehicles.length} vehicles seeded successfully`);

    // Don't close connection if called as module
    if (import.meta.url === `file://${process.argv[1]}`) {
      mongoose.connection.close();
      console.log('Database connection closed');
    }
  } catch (error) {
    console.error('Error seeding vehicles:', error);
    if (import.meta.url === `file://${process.argv[1]}`) {
      process.exit(1);
    }
    throw error;
  }
};

// Run seed if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedVehicles();
}

export default seedVehicles;
