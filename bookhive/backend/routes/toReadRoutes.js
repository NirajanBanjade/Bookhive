const express = require('express');
const router = express.Router();
const {
  getToReadList,
  addBookToToRead,
  removeBookFromToRead
} = require('../controllers/toReadController');

// Get a user’s to-read list
router.get('/:userId', getToReadList);

// Add a book (body: { googleBookId, title, authors, thumbnail })
router.post('/:userId', addBookToToRead);

// Remove a book from list
router.delete('/:userId/:googleBookId', removeBookFromToRead);

module.exports = router;
