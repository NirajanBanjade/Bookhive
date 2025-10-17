const path = require('path');
// require('dotenv').config();

require('dotenv').config({ path: path.join(__dirname, '.env') });
// Load Google Books API key from environment
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;
console.log('=================================');
console.log('🔑 API Key Check:');
console.log('API Key loaded:', !!GOOGLE_BOOKS_API_KEY);
console.log('API Key length:', GOOGLE_BOOKS_API_KEY?.length);
console.log('API Key preview:', GOOGLE_BOOKS_API_KEY?.substring(0, 10) + '...');
console.log('=================================');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
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

// Placeholder root route for temporary test of google books api key
app.get('/api/test-google-books', (req, res) => {
  if (GOOGLE_BOOKS_API_KEY) {
    res.send(`Google Books API key loaded: ${GOOGLE_BOOKS_API_KEY.substring(0, 5)}...`);
  } else {
    res.status(500).send('API key not loaded');
  }
});

app.get('/', (_req, res) => res.send('BookHive API running'));
app.get('/health', (_req, res) => res.json({ ok: true, service: 'bookhive-backend' }));

// Import and register routes
const toReadRoutes = require('./routes/toReadRoutes');
app.use('/api/to-read', toReadRoutes);

// Register user routes
const toGetUserRoutes = require('./routes/toGetUserRoutes');
app.use('/api/users', toGetUserRoutes);

// Consolidated books routes 
const booksRoutes = require('./routes/booksRoutes');
app.use('/api/books', booksRoutes);

const toUserProfile=require('./routes/toUserData');
app.use('/api/profile', requireAuth, toUserProfile);


const toUpdateUserPassword=require('./routes/toUpdatePassword');
app.use('/api/update-password', toUpdateUserPassword);
module.exports = app;

// Profile API routes - handles user profile viewing and editing
const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', profileRoutes);
const collectionsRoutes = require('./routes/collectionsRoutes');  
app.use('/api/collections', collectionsRoutes);

const notificationRoutes = require("./routes/notifications");
app.use("/api/notifications", notificationRoutes);

// Recommendation API routes - handles interest profile and recommendations
const recommendationsRoutes = require('./routes/recommendationsRoutes');
app.use('/api/recommendations', recommendationsRoutes);

// Group join/leave (and later posts)
const groupRoutes = require('./routes/groupRoutes');
// protect only these with auth (or move auth inside the router)
app.use('/api', requireAuth, groupRoutes);

//display user details in a specific group.
const groupsRouter = require('./routes/userDetailsSameGroup');
app.use('/api', groupsRouter);

