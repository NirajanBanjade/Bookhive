const express = require('express');
const router = express.Router();
const {
  getToReadList,
  addBookToToRead,
  removeBookFromToRead,
  searchToReadBooks,
  getNotifications
} = require('../controllers/toReadController');

// Get a user’s to-read list
router.get('/:userId', getToReadList);
router.get('/:userId/search', searchToReadBooks);

// Add a book (body: { googleBookId, title, authors, thumbnail })
router.post('/:userId', addBookToToRead);

// Remove a book from list
router.delete('/:userId/:googleBookId', removeBookFromToRead);

router.get('/:userId/search', searchToReadBooks);

// Get notifications for a user
router.get('/:userId/notifications', getNotifications);

module.exports = router;
