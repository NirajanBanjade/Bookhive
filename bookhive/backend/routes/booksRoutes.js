// routes/booksRoutes.js
const express = require('express');
const router = express.Router();
const { searchBooks } = require('../controllers/bookController');
const { validateQuery } = require('../utils/validateQuery');

router.get('/search', validateQuery(), searchBooks);

module.exports = router;
