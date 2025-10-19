import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Product from '../models/Product.js';

const router = express.Router();

// Example: Get all products (protected route)
router.get('/', protect, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;

