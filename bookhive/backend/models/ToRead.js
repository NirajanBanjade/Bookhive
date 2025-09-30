const mongoose = require('mongoose');

const ToReadSchema = new mongoose.Schema({
  userId: { type: String, required: true, index:true },
  books: [
    {
      googleBookId: String,
      title: String,
      authors: [String],
      thumbnail: String,
    },
  ],
}, { timestamps: true });


// 🔹 Add a text index to speed up keyword search on embedded fields
ToReadSchema.index({
  'books.title': 'text',
  'books.authors': 'text'
});

module.exports = mongoose.model('ToRead', ToReadSchema);
