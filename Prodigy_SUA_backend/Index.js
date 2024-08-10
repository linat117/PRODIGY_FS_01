const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User');
const authRoutes = require('./authRoutes');
const authorize = require('./middlewares/roleMiddleware');
const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'Prodigy12345';

// CORS configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true // Allow credentials to be included
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use('/api', authRoutes);

const generateToken = (user) => {
  return jwt.sign({ email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
};

// JWT Authentication Middleware
const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send('Access denied');
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send('Invalid token');
    req.user = decoded;
    next();
  });
};

const authenticateUser = async (email, password) => {
  try {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    return isMatch ? user : null;
  } catch (error) {
    console.error('Error authenticating user:', error);
    return null;
  }
};

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/Prodigy_Secure_user_authentication');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { username, email, password, confirmPassword, role } = req.body;

  if (!username || !email || !password || !confirmPassword || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'User already exists' });
  }
  if (!role || (role !== 'user' && role !== 'admin')) {
    return res.status(400).json({ error: 'Invalid role specified' });
  }
  
  const passwordHash = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, passwordHash, role });
  await newUser.save();

  res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await authenticateUser(email, password);

  if (user) {
    const token = generateToken(user);
    res.json({ token, role: user.role });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
});


// Admin-only Route
app.get('/api/admin', authenticate, authorize(['admin']), (req, res) => {
  res.send('Hello Admin');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
