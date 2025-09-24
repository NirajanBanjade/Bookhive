const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Route for searching books by title
router.get('/search', bookController.searchBooks);

module.exports = router;