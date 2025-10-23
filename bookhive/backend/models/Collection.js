const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String, maxlength: 500 },
  reviewedAt: { type: Date, default: Date.now },
}, { _id: false });  // No sub-doc ID

const bookSchema = new mongoose.Schema({
  googleBookId: { type: String, required: true },
  title: { type: String, required: true },
  authors: [{ type: String }],
  thumbnail: { type: String },
  categories: [{ type: String }],
  status: { 
    type: String, 
    enum: ['currently-reading', 'completed'], 
    default: 'currently-reading'  // Default for new books
  },
  review: { type: reviewSchema, required: false }  // Optional
}, { _id: false });

const collectionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  books: [bookSchema]
}, { timestamps: true });

// Indexes for query speed
collectionSchema.index({ userId: 1 });
collectionSchema.index({ 'books.googleBookId': 1 });

module.exports = mongoose.model('Collection', collectionSchema);