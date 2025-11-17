// backend/controllers/favoritesController.js
const FavoriteService = require('../services/FavoriteService');

/**
 * Get all favorites for a user
 * GET /api/favorites/:userId
 */
exports.getFavorites = async (req, res) => {
  try {
    const { userId } = req.params;

    const favorites = await FavoriteService.getUserFavorites(userId);

    res.status(200).json(favorites);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ 
      message: 'Failed to fetch favorites',
      error: error.message 
    });
  }
};

/**
 * Add a book to favorites
 * POST /api/favorites/:userId
 * Body: { googleBookId, title, authors, thumbnail, categories }
 */
exports.addFavorite = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookData = req.body;

    // Validate required fields
    if (!bookData.googleBookId || !bookData.title) {
      return res.status(400).json({ 
        message: 'googleBookId and title are required' 
      });
    }

    const result = await FavoriteService.addFavorite(userId, bookData);

    // Return 200 if already favorited, 201 if newly created
    const statusCode = result.alreadyFavorited ? 200 : 201;
    res.status(statusCode).json(result);
  } catch (error) {
    console.error('Error adding favorite:', error);
    
    // Handle duplicate key error (shouldn't happen due to check, but just in case)
    if (error.code === 11000) {
      return res.status(409).json({ 
        message: 'Book is already in favorites' 
      });
    }

    res.status(500).json({ 
      message: 'Failed to add favorite',
      error: error.message 
    });
  }
};

/**
 * Remove a book from favorites
 * DELETE /api/favorites/:userId/:googleBookId
 */
exports.removeFavorite = async (req, res) => {
  try {
    const { userId, googleBookId } = req.params;

    const result = await FavoriteService.removeFavorite(userId, googleBookId);

    if (!result.removed) {
      return res.status(404).json({ message: result.message });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ 
      message: 'Failed to remove favorite',
      error: error.message 
    });
  }
};

/**
 * Toggle favorite status (add if not favorited, remove if favorited)
 * POST /api/favorites/:userId/toggle
 * Body: { googleBookId, title, authors, thumbnail, categories }
 */
exports.toggleFavorite = async (req, res) => {
  try {
    const { userId } = req.params;
    const bookData = req.body;

    // Validate required fields
    if (!bookData.googleBookId || !bookData.title) {
      return res.status(400).json({ 
        message: 'googleBookId and title are required' 
      });
    }

    const result = await FavoriteService.toggleFavorite(userId, bookData);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ 
      message: 'Failed to toggle favorite',
      error: error.message 
    });
  }
};

/**
 * Check if a book is favorited
 * GET /api/favorites/:userId/check/:googleBookId
 */
exports.checkFavorite = async (req, res) => {
  try {
    const { userId, googleBookId } = req.params;

    const isFavorited = await FavoriteService.isFavorited(userId, googleBookId);

    res.status(200).json({ isFavorited });
  } catch (error) {
    console.error('Error checking favorite:', error);
    res.status(500).json({ 
      message: 'Failed to check favorite status',
      error: error.message 
    });
  }
};

/**
 * Get favorites count for a user
 * GET /api/favorites/:userId/count
 */
exports.getFavoritesCount = async (req, res) => {
  try {
    const { userId } = req.params;

    const count = await FavoriteService.getFavoritesCount(userId);

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching favorites count:', error);
    res.status(500).json({ 
      message: 'Failed to fetch favorites count',
      error: error.message 
    });
  }
};