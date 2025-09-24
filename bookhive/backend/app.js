require('dotenv').config();
// Load Google Books API key from environment
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Placeholder root route for tempporary test of google books api key
app.get('/api/test-google-books', (req, res) => {
  if (GOOGLE_BOOKS_API_KEY) {
    res.send(`Google Books API key loaded: ${GOOGLE_BOOKS_API_KEY.substring(0, 5)}...`);
  } else {
    res.status(500).send('API key not loaded');
  }
});

// Import and register routes
const toReadRoutes = require('./routes/toReadRoutes');
app.use('/api/to-read', toReadRoutes);

module.exports = app;
