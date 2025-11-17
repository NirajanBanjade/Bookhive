// backend/services/FavoriteService.js
const FavoriteRepository = require('../repositories/FavoriteRepository');
const NotificationService = require('./NotificationService');

class FavoriteService {
  /**
   * Get all favorites for a user
   * @param {String} userId - User's MongoDB ID
   * @returns {Promise<Array>} Array of favorite books
   */
  async getUserFavorites(userId) {
    return await FavoriteRepository.findByUserId(userId);
  }

  /**
   * Add a book to user's favorites
   * @param {String} userId - User's MongoDB ID
   * @param {Object} bookData - { googleBookId, title, authors, thumbnail, categories }
   * @returns {Promise<Object>} Result object with favorite and status
   */
  async addFavorite(userId, bookData) {
    const { googleBookId, title, authors, thumbnail, categories } = bookData;

    // Check if already favorited
    const existing = await FavoriteRepository.findByUserAndBook(userId, googleBookId);
    if (existing) {
      return {
        favorite: existing,
        alreadyFavorited: true,
        message: 'Book is already in favorites'
      };
    }

    // Create favorite
    const favorite = await FavoriteRepository.create({
      userId,
      googleBookId,
      title,
      authors: authors || [],
      thumbnail: thumbnail || null,
      categories: categories || []
    });

    // Create notification
    try {
      await NotificationService.createNotification(
        userId,
        'favorite_added',
        `Added "${title}" to favorites`,
        { googleBookId, title }
      );
    } catch (error) {
      console.error('Failed to create favorite notification:', error);
      // Don't fail the request if notification fails
    }

    return {
      favorite,
      alreadyFavorited: false,
      message: 'Book added to favorites'
    };
  }

  /**
   * Remove a book from user's favorites
   * @param {String} userId - User's MongoDB ID
   * @param {String} googleBookId - Google Books API ID
   * @returns {Promise<Object>} Result object with status
   */
  async removeFavorite(userId, googleBookId) {
    const favorite = await FavoriteRepository.deleteByUserAndBook(userId, googleBookId);

    if (!favorite) {
      return {
        removed: false,
        message: 'Book was not in favorites'
      };
    }

    // Create notification
    try {
      await NotificationService.createNotification(
        userId,
        'favorite_removed',
        `Removed "${favorite.title}" from favorites`,
        { googleBookId, title: favorite.title }
      );
    } catch (error) {
      console.error('Failed to create favorite removal notification:', error);
      // Don't fail the request if notification fails
    }

    return {
      removed: true,
      favorite,
      message: 'Book removed from favorites'
    };
  }

  /**
   * Toggle favorite status (add if not favorited, remove if favorited)
   * @param {String} userId - User's MongoDB ID
   * @param {Object} bookData - { googleBookId, title, authors, thumbnail, categories }
   * @returns {Promise<Object>} Result object with status and action taken
   */
  async toggleFavorite(userId, bookData) {
    const { googleBookId } = bookData;
    const isFavorited = await FavoriteRepository.isFavorited(userId, googleBookId);

    if (isFavorited) {
      const result = await this.removeFavorite(userId, googleBookId);
      return {
        ...result,
        action: 'removed',
        isFavorited: false
      };
    } else {
      const result = await this.addFavorite(userId, bookData);
      return {
        ...result,
        action: 'added',
        isFavorited: true
      };
    }
  }

  /**
   * Check if a book is favorited by user
   * @param {String} userId - User's MongoDB ID
   * @param {String} googleBookId - Google Books API ID
   * @returns {Promise<Boolean>} True if favorited
   */
  async isFavorited(userId, googleBookId) {
    return await FavoriteRepository.isFavorited(userId, googleBookId);
  }

  /**
   * Get favorites count for a user
   * @param {String} userId - User's MongoDB ID
   * @returns {Promise<Number>} Count of favorites
   */
  async getFavoritesCount(userId) {
    return await FavoriteRepository.countByUserId(userId);
  }
}

module.exports = new FavoriteService();