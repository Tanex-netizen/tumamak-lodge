import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from '../models/Vehicle.js';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const updateVehiclePrices = async () => {
  try {
    console.log('🔌 Connecting to database:', process.env.MONGODB_URI ? 'Production' : 'Local');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected...');

    // Get all vehicles
    const vehicles = await Vehicle.find({});
    console.log(`\n📋 Found ${vehicles.length} vehicles with current prices:`);
    
    vehicles.forEach(v => {
      console.log(`   - ${v.name}: ₱${v.pricePerDay}/day → ₱${v.pricePerDay - 100}/day`);
    });

    // Ask for confirmation
    rl.question('\n❓ Do you want to reduce all prices by ₱100? (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
        console.log('\n🔄 Updating prices...');
        
        // Update each vehicle's price by subtracting 100
        for (const vehicle of vehicles) {
          const oldPrice = vehicle.pricePerDay;
          vehicle.pricePerDay = oldPrice - 100;
          await vehicle.save();
          console.log(`   ✓ ${vehicle.name}: ₱${oldPrice} → ₱${vehicle.pricePerDay}`);
        }

        console.log('\n✅ All vehicle prices updated successfully in production!');
      } else {
        console.log('❌ Operation cancelled.');
      }
      
      mongoose.connection.close();
      rl.close();
      console.log('🔌 Database connection closed');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error updating vehicle prices:', error);
    mongoose.connection.close();
    rl.close();
    process.exit(1);
  }
};

updateVehiclePrices();
