const mongoose = require('mongoose');

const ToReadSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  books: [
    {
      googleBookId: String,
      title: String,
      authors: [String],
      thumbnail: String,
    },
  ],
});

module.exports = mongoose.model('ToRead', ToReadSchema);
