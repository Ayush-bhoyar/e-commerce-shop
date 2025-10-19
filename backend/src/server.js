import dotenv from 'dotenv';
import express from 'express';
import connectDB from './config/db.js';
import Product from './models/Product.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check
app.get('/healthz', (req, res) => res.send('ok'));

// 🔐 Auth routes (Step 3.5)
app.use('/api/auth', authRoutes);

// 🛒 Products route (fetch all)
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
app.get('/', (req, res) =>
  res.send('ShopSmart Backend Running with MongoDB...')
);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));

