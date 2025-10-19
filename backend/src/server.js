require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const Product = require('./models/Product');

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check
app.get('/healthz', (req, res) => res.send('ok'));

// Products route (fetch all)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Root
app.get('/', (req, res) => res.send('ShopSmart Backend Running with MongoDB...'));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));

