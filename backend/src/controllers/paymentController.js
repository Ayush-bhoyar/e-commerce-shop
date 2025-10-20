// backend/src/controllers/paymentController.js

import dotenv from 'dotenv';
dotenv.config(); // Must be first

import Stripe from 'stripe';
import Product from '../models/Product.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
  const { cartItems } = req.body; 
  // cartItems = [{ productId: 'xxx', quantity: 2 }, ...]

  try {
    let totalAmount = 0;

    // 1️⃣ Calculate total from product prices
    for (const item of cartItems) {
      const product = await Product.findById(item.productId);
      if (!product) continue;
      totalAmount += product.price * item.quantity;
    }

    // Convert to cents for Stripe
    const amountInCents = Math.round(totalAmount * 100);

    // 2️⃣ Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('❌ Payment error:', err);
    res.status(500).json({ error: 'Payment failed' });
  }
};
