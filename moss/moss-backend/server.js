const express = require('express');
const cors = require('cors');
const authRoutes = require('./auth');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(process.env.PORT || 3001, () => {
  console.log('Server running on port', process.env.PORT || 3001);
});
