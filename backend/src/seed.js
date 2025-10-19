require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const products = [
  { name: 'T-Shirt', price: 20.0, image: '/images/tshirt.png' },
  { name: 'Headphones', price: 59.99, image: '/images/headphones.png' },
  { name: 'Sneakers', price: 79.99, image: '/images/sneakers.png' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    await Product.deleteMany();
    await Product.insertMany(products);
    console.log('✅ Sample products inserted');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();

