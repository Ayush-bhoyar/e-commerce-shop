import dotenv from 'dotenv';
dotenv.config();  // Must be first

import express from 'express';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import redisClient from './config/redisClient.js';

const app = express();
app.use(express.json());

// Connect MongoDB
connectDB();

// Health check
app.get('/healthz', (req, res) => res.send('ok'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);

// Root
app.get('/', (req, res) =>
  res.send('ShopSmart Backend Running with MongoDB...')
);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
