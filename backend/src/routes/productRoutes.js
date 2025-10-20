import express from 'express';
import Product from '../models/Product.js';
import redisClient from '../config/redisClient.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all products (protected + Redis cache)
router.get('/', protect, async (req, res) => {
  try {
    // 1️⃣ Check cache first
    const cacheProducts = await redisClient.get('products');
    if (cacheProducts) {
      console.log('✅ Serving from Redis cache');
      return res.json(JSON.parse(cacheProducts));
    }

    // 2️⃣ Cache miss — fetch from MongoDB
    const products = await Product.find();

    // 3️⃣ Store in cache for 60 seconds
    await redisClient.setEx('products', 60, JSON.stringify(products));
    console.log('💾 Data cached in Redis');

    res.json(products);
  } catch (err) {
    console.error('❌ Error fetching products:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// POST new product (protected + Redis cache invalidation)
router.post('/', protect, async (req, res) => {
  try {
    const { name, price, image } = req.body;
    const product = await Product.create({ name, price, image });

    // Clear Redis cache
    await redisClient.del('products');
    console.log('🧹 Redis cache cleared after new product');

    res.status(201).json(product);
  } catch (err) {
    console.error('❌ Error creating product:', err);
    res.status(500).json({ error: 'Server Error' });
  }
});

export default router;
