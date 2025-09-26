const express = require('express');
const router = express.Router();
const {searchBooks} = require('../controllers/bookController');

// Route for searching books by title
router.get('/search', searchBooks);

module.exports = router;