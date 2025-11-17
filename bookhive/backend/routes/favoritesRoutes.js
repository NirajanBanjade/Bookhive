// backend/routes/favoritesRoutes.js
const express = require('express');
const router = express.Router();
const favoritesController = require('../controllers/favoritesController');

// Get all favorites for a user
router.get('/:userId', favoritesController.getFavorites);

// Get favorites count for a user
router.get('/:userId/count', favoritesController.getFavoritesCount);

// Check if a specific book is favorited
router.get('/:userId/check/:googleBookId', favoritesController.checkFavorite);

// Add a book to favorites
router.post('/:userId', favoritesController.addFavorite);

// Toggle favorite status (add or remove)
router.post('/:userId/toggle', favoritesController.toggleFavorite);

// Remove a book from favorites
router.delete('/:userId/:googleBookId', favoritesController.removeFavorite);

module.exports = router;