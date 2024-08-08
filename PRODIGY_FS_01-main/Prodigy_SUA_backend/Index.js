const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const authRoutes = require('./authRoutes');
const authorize = require('./middlewares/roleMiddleware');
const bcrypt = require('bcrypt');
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'Prodigy12345';
const users = {
  'admin@example.com': { role: 'admin', passwordHash: bcrypt.hashSync('adminpass', 10) },
  'user@example.com': { role: 'user', passwordHash: bcrypt.hashSync('userpass', 10) }
};
// Middleware
app.use(bodyParser.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5174/', // Replace with your frontend's URL
  credentials: true // If you are sending cookies or authorization headers
}));
app.options('*', cors({
  origin: 'http://localhost:5174',
  credentials: true
}));

app.use('/api', authRoutes);
//app.options('*', cors());

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
  if (users[email]) {
    return res.status(400).json({ error: 'User already exists' });
  }
  if (!username || !email || !password || !confirmPassword || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Check if password and confirmPassword match
  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users[email] = { role, passwordHash };

  res.status(201).json({ message: 'User registered successfully' });
});

// Login endpoint
// Example of a login endpoint
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Perform authentication logic...
  const user = await authenticateUser(email, password);

  if (user) {
    const token = generateToken(user); // Function to generate JWT or similar
    const role = user.role; // Assuming the role is stored in the user object

    // Send back token and role
    res.json({ token, role });
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
