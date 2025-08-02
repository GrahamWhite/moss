// server.js

require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;

// For demo: a simple user store (in-memory)
const users = new Map(); // username -> hashedPassword

const allowedOrigins = [
  'https://flumpy.ca',
  'https://www.flumpy.ca',
  'http://localhost:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow server-to-server or postman calls
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // if you need cookies/auth headers
}));

app.use(express.json());

// Register endpoint (creates user with hashed password)
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    console.log("Registering User");
    return res.status(400).json({ error: 'Username and password required' });
    }
  if (users.has(username))
    return res.status(409).json({ error: 'User already exists' });
  
  try {
    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashed = await bcrypt.hash(password, saltRounds);
    users.set(username, hashed);
    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login endpoint (checks password and issues a JWT token)
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ error: 'Username and password required' });

  const storedHash = users.get(username);
  if (!storedHash)
    return res.status(401).json({ error: 'Invalid credentials' });

  try {
    const valid = await bcrypt.compare(password, storedHash);
    if (valid) {
      // Create JWT token
      const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ message: 'Login successful', token });
    } else {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected route example (requires JWT)
app.get('/api/protected', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer token

  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid or expired token' });

    res.json({ message: 'Protected content accessed', user: decoded });
  });
});

app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
