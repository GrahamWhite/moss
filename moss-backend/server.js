require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 4000;

// Create MySQL connection pool
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'moss',
  password: process.env.DB_PASSWORD || 'Snoops123*!',
  database: process.env.DB_NAME || 'moss_users',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

console.log('DB Config:', {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

let pool;
async function initDB() {
  pool = await mysql.createPool(dbConfig);
}
initDB();

// CORS setup
const allowedOrigins = [
  'https://flumpy.ca',
  'https://www.flumpy.ca',
  'http://localhost:3000',
  'http://192.168.68.55:3000'
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// REGISTER endpoint
app.post('/api/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    const [rows] = await pool.execute('SELECT email FROM users WHERE email = ?', [username]);
    if (rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.execute(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN endpoint
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Email and password required' });

  try {
    const [rows] = await pool.execute('SELECT email, password_hash FROM users WHERE email = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Protected route
app.get('/api/protected', (req, res) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid or expired token' });

    res.json({ message: 'Protected content accessed', user: decoded });
  });
});

app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
