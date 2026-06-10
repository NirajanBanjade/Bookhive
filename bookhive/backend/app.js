const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Load Google Books API key from environment
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
if (process.env.NODE_ENV !== 'production') {
  console.log('=================================');
  console.log('Google Books API key loaded:', !!GOOGLE_BOOKS_API_KEY);
  console.log('Google Books API key length:', GOOGLE_BOOKS_API_KEY?.length);
  console.log('=================================');
}

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowAnyProductionOrigin = process.env.NODE_ENV === 'production' && !process.env.CORS_ORIGIN && !process.env.FRONTEND_URL;

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || allowAnyProductionOrigin) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.MONGO_DB_NAME || 'Bookhive',
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Test routes
app.get('/api/test-google-books', (req, res) => {
  if (GOOGLE_BOOKS_API_KEY) {
    res.send(`Google Books API key loaded: ${GOOGLE_BOOKS_API_KEY.substring(0, 5)}...`);
  } else {
    res.status(500).send('API key not loaded');
  }
});

if (process.env.NODE_ENV !== 'production') {
  app.get('/', (_req, res) => res.send('BookHive API running'));
}
app.get('/health', (_req, res) => res.json({ ok: true, service: 'bookhive-backend' }));

// Import and register routes
const toReadRoutes = require('./routes/toReadRoutes');
app.use('/api/to-read', toReadRoutes);

const toGetUserRoutes = require('./routes/toGetUserRoutes');
app.use('/api/users', toGetUserRoutes);

const booksRoutes = require('./routes/booksRoutes');
app.use('/api/books', booksRoutes);

const toUserProfile = require('./routes/toUserData');
app.use('/api/user', toUserProfile);

const toUpdateUserPassword = require('./routes/toUpdatePassword');
app.use('/api/update-password', toUpdateUserPassword);

const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', profileRoutes);
app.use('/api/user', profileRoutes); 

const collectionsRoutes = require('./routes/collectionsRoutes');
app.use('/api/collections', collectionsRoutes);

const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

const reviewsRoutes = require('./routes/reviewsRoutes');
app.use('/api/reviews', reviewsRoutes);

const favoritesRoutes = require('./routes/favoritesRoutes');
app.use('/api/favorites', favoritesRoutes);

const recommendationsRoutes = require('./routes/recommendationsRoutes');
app.use('/api/recommendations', recommendationsRoutes);

const groupRoutes = require('./routes/groupRoutes');
app.use('/api', groupRoutes);

const frontendBuildPath = path.join(__dirname, '..', 'frontend', 'build');
app.use(express.static(frontendBuildPath));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

module.exports = app;
