const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getToReadList,
  addBookToToRead,
  removeBookFromToRead,
  searchToReadBooks,
  moveBookToCollections,
  getNotifications
} = require('../controllers/toReadController');

// --------------------
// GET routes
// --------------------

// Get a user's to-read list
router.get('/:userId', getToReadList);

// Search books in to-read list
router.get('/:userId/search', searchToReadBooks);

// Get notifications for a user
router.get('/:userId/notifications', getNotifications);

// --------------------
// POST routes
// --------------------

// Add a book to to-read
router.post('/:userId', addBookToToRead);

// Move a book from to-read to collections
router.post('/:userId/:googleBookId/move-to-collections', moveBookToCollections);

// --------------------
// DELETE routes
// --------------------

// Remove a book from to-read list
router.delete('/:userId/:googleBookId', removeBookFromToRead);

module.exports = router;
