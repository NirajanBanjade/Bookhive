const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getToReadList,
  addBookToToRead,
  removeBookFromToRead,
  searchToReadBooks,
  moveBookToCollections,
  moveBookToCollectionsRoute, 
} = require('../controllers/toReadController');

// GET routes
router.get('/:userId/search', searchToReadBooks);
router.get('/:userId', getToReadList);

// POST routes
router.post('/:userId', addBookToToRead);
router.post('/:userId/:googleBookId/move-to-collections', moveBookToCollections);
router.post('/:userId/:googleBookId/move', moveBookToCollectionsRoute); // NEW: Add this route

// DELETE routes
router.delete('/:userId/:googleBookId', removeBookFromToRead);

module.exports = router;