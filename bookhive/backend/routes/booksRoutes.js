const express = require('express');
const router = express.Router();
const {
  searchBooks,
  getTrendingBooks,
  getBooksByGenre,
  getBookById, 
} = require("../controllers/bookController");
const { validateQuery } = require('../utils/validateQuery');

router.get('/search', validateQuery(), searchBooks);
router.get("/trending", getTrendingBooks);
router.get("/genre/:subject", getBooksByGenre);
router.get("/:googleBookId", getBookById); 

module.exports = router;