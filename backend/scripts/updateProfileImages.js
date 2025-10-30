import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const updateProfileImages = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tumamak-lodge');
    console.log('MongoDB connected...');

    // Update all users with the old default Cloudinary image
    const result = await User.updateMany(
      { 
        $or: [
          { profileImage: 'https://res.cloudinary.com/demo/image/upload/avatar-default.png' },
          { profileImage: { $exists: false } },
          { profileImage: '' }
        ]
      },
      { $set: { profileImage: '/profile.jpg' } }
    );

    console.log(`✅ Updated ${result.modifiedCount} users with new default profile image`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error updating profile images:', error);
    process.exit(1);
  }
};

updateProfileImages();
