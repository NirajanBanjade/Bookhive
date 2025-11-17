// backend/models/Favorite.js
const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  googleBookId: {
    type: String,
    required: true,
    index: true
  },
  // Store book data for quick access (avoid extra API calls)
  title: {
    type: String,
    required: true
  },
  authors: [String],
  thumbnail: String,
  categories: [String],
  addedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure a user can't favorite the same book twice
favoriteSchema.index({ userId: 1, googleBookId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;