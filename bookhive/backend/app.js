require('dotenv').config();
// Load Google Books API key from environment
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
const requireAuth = require('./middleware/jwt_auth');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.MONGO_DB_NAME || 'Bookhive',
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


// Register user routes
const toGetUserRoutes = require('./routes/toGetUserRoutes');
app.use('/api/users', toGetUserRoutes);

// Import and register books routes
const bookRoutes = require('./routes/bookRoutes');
app.use(express.json()); //Middleware to parse JSON
app.use('/api/books', bookRoutes);

const toUserProfile=require('./routes/toUserData');
app.use('/api/profile', requireAuth, toUserProfile);


const toUpdateUserPassword=require('./routes/toUpdatePassword');
app.use('/api/update-password', toUpdateUserPassword);
module.exports = app;
