const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const users = {}; // Replace with DB later
const saltRounds = 12;
const pepper = process.env.PEPPER;

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const saltedHash = await bcrypt.hash(password + pepper, saltRounds);
  users[username] = { password: saltedHash };
  res.status(201).json({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password + pepper, user.password);
  if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

module.exports = router;
