const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const authenticate = require('./middlewares/authMiddleware'); // Adjust path if needed
const authorize = require('./middlewares/roleMiddleware'); // Import role middleware

const router = express.Router();
const JWT_SECRET = 'Prodigy12345';

// Registration Endpoint
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).send('All fields are required');
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send('User already exists');
    }
    const newUser = new User({ username, email, password, role });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send('Invalid email or password');
    }
    user.comparePassword(password, (err, isMatch) => {
      if (err) return res.status(500).send('Internal server error');
      if (!isMatch) return res.status(401).send('Invalid email or password');
      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Admin-only Route
router.get('/admin', authenticate, authorize(['admin']), (req, res) => {
  res.send('Hello Admin');
});

module.exports = router;
