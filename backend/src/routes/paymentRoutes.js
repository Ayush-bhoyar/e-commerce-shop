// backend/src/routes/paymentRoutes.js
import express from 'express';
import { createPaymentIntent } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route → only logged in users
router.post('/', protect, createPaymentIntent);


export default router;
