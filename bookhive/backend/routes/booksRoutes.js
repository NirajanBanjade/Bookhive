// routes/booksRoutes.js
const express = require('express');
const router = express.Router();
const {
  searchBooks,
  getTrendingBooks,
} = require("../controllers/bookController");
const { validateQuery } = require('../utils/validateQuery');

router.get('/search', validateQuery(), searchBooks);
router.get("/trending", getTrendingBooks);

module.exports = router;
