const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  googleBookId: { type: String, required: true },
  title: { type: String, required: true },
  authors: [{ type: String }],
  thumbnail: { type: String }
}, { _id: false });

const collectionSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  books: [bookSchema]
}, { timestamps: true });

module.exports = mongoose.model('Collection', collectionSchema);
