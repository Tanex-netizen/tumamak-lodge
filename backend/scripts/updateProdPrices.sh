#!/bin/bash

# This script updates vehicle prices in the production database
# Usage: ./updateProdPrices.sh <MONGODB_URI>

if [ -z "$1" ]; then
    echo "❌ Error: MongoDB URI required"
    echo "Usage: ./updateProdPrices.sh 'mongodb+srv://user:pass@cluster.mongodb.net/dbname'"
    exit 1
fi

MONGODB_URI="$1" node -e "
import('mongoose').then(mongoose => {
  mongoose.default.connect(process.env.MONGODB_URI).then(() => {
    console.log('✅ Connected to production database');
    import('./models/Vehicle.js').then(({ default: Vehicle }) => {
      Vehicle.find({}).then(vehicles => {
        console.log('📋 Found', vehicles.length, 'vehicles');
        Promise.all(vehicles.map(v => {
          const oldPrice = v.pricePerDay;
          v.pricePerDay = oldPrice - 100;
          console.log('✓', v.name + ':', oldPrice, '→', v.pricePerDay);
          return v.save();
        })).then(() => {
          console.log('✅ All prices updated!');
          mongoose.default.connection.close();
          process.exit(0);
        });
      });
    });
  }).catch(err => {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  });
});"
