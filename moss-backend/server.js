require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const xss = require('xss');
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 4000;

// --- MySQL connection pool ---
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'moss',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'moss_users',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool;
async function initDB() {
  pool = await mysql.createPool(dbConfig);
}
initDB();

// --- Security Middleware ---
app.use(helmet()); // Adds common HTTP security headers

// Rate limiting: max 5 requests per minute per IP for login/register
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 5,
  message: { error: 'Too many requests, please try again later.' }
});

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
      callback(new Error('CORS policy violation'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json({ limit: '10kb' })); // Limit request body size

// --- Helper: sanitize and validate email/password ---
function validateCredentials(email, password) {
  if (!email || !password) return false;
  if (!validator.isEmail(email)) return false;
  if (password.length < 8 || password.length > 64) return false;
  return true;
}

// --- REGISTER ---
app.post('/api/register', authLimiter, async (req, res) => {
  let { username, password } = req.body;

  username = validator.normalizeEmail(username || '');
  password = xss(password || '');

  if (!validateCredentials(username, password)) {
    return res.status(400).json({ error: 'Invalid email or password format' });
  }

  try {
    const [rows] = await pool.execute('SELECT email FROM users WHERE email = ?', [username]);
    if (rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS) || 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await pool.execute(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- LOGIN ---
app.post('/api/auth/login', authLimiter, async (req, res) => {
  let { username, password } = req.body;

  username = validator.normalizeEmail(username || '');
  password = xss(password || '');

  if (!validateCredentials(username, password)) {
    return res.status(400).json({ error: 'Invalid email or password format' });
  }

  try {
    const [rows] = await pool.execute(
      'SELECT email, password_hash, role FROM users WHERE email = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const valid = await bcrypt.compare(password, rows[0].password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const userRole = rows[0].role || 'user';

    const token = jwt.sign(
      { email: username, role: userRole },
      process.env.JWT_SECRET,
      { expiresIn: '1h', algorithm: 'HS256' }
    );

    res.json({ message: 'Login successful', token, role: userRole });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Protected route ---
app.get('/api/protected', (req, res) => {
  const authHeader = req.headers['authorization'] || '';
  const token = authHeader.split(' ')[1];

  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] }, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid or expired token' });

    res.json({ message: 'Protected content accessed', user: decoded });
  });
});

// --- Start server ---
app.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});
