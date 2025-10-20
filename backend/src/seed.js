import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db.js';
import Product from './models/Product.js';
import redisClient from './config/redisClient.js'; // Redis import

const products = [
  { name: 'T-Shirt', price: 20, image: '/images/tshirt.png' },
  { name: 'Headphones', price: 59.99, image: '/images/headphones.png' },
  { name: 'Sneakers', price: 79.99, image: '/images/sneakers.png' },
];

const importData = async () => {
  try {
    await connectDB();
    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('✅ Data Imported!');

    // Clear Redis cache after seeding
    await redisClient.del('products');
    console.log('🧹 Redis cache cleared');

    process.exit();
  } catch (error) {
    console.error('❌ Error with data import:', error);
    process.exit(1);
  }
};

importData();
