import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.json({ _id: user._id, name: user.name, email: user.email, token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;

