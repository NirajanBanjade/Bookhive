const express = require('express');
const router = express.Router();

// Import controller functions
const {
  getToReadList,
  addBookToToRead,
  removeBookFromToRead,
  searchToReadBooks,
  moveBookToCollections,
} = require('../controllers/toReadController');


// get routes
router.get('/:userId/search', searchToReadBooks);

// ✅ THEN PUT GENERIC ROUTES
router.get('/:userId', getToReadList);

// POST routes
router.post('/:userId', addBookToToRead);
router.post('/:userId/:googleBookId/move-to-collections', moveBookToCollections);

// DELETE routes
router.delete('/:userId/:googleBookId', removeBookFromToRead);

module.exports = router;
