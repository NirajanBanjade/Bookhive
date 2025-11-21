const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  googleBookId: { type: String, required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },
  authorName: { type: String, required: true }, // NEW FIELD
  reviewedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);