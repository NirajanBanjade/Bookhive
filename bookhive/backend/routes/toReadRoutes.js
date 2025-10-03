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


// get routes
router.get('/:userId', getToReadList);

router.get('/:userId/search', searchToReadBooks);

router.get('/:userId/notifications', getNotifications);

// post routes
router.post('/:userId', addBookToToRead);

router.post('/:userId/:googleBookId/move-to-collections', moveBookToCollections);

// delete routes
router.delete('/:userId/:googleBookId', removeBookFromToRead);

module.exports = router;
