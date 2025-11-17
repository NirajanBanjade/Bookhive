// backend/repositories/FavoriteRepository.js
const Favorite = require('../models/Favorite');

class FavoriteRepository {
  /**
   * Get all favorites for a user
   * @param {String} userId - User's MongoDB ID
   * @returns {Promise<Array>} Array of favorite documents
   */
  async findByUserId(userId) {
    return await Favorite.find({ userId }).sort({ addedAt: -1 });
  }

  /**
   * Check if a book is favorited by user
   * @param {String} userId - User's MongoDB ID
   * @param {String} googleBookId - Google Books API ID
   * @returns {Promise<Boolean>} True if favorited, false otherwise
   */
  async isFavorited(userId, googleBookId) {
    const favorite = await Favorite.findOne({ userId, googleBookId });
    return !!favorite;
  }

  /**
   * Add a book to favorites
   * @param {Object} favoriteData - { userId, googleBookId, title, authors, thumbnail, categories }
   * @returns {Promise<Object>} Created favorite document
   */
  async create(favoriteData) {
    const favorite = new Favorite(favoriteData);
    return await favorite.save();
  }

  /**
   * Remove a book from favorites
   * @param {String} userId - User's MongoDB ID
   * @param {String} googleBookId - Google Books API ID
   * @returns {Promise<Object>} Deleted favorite document
   */
  async deleteByUserAndBook(userId, googleBookId) {
    return await Favorite.findOneAndDelete({ userId, googleBookId });
  }

  /**
   * Get count of favorites for a user
   * @param {String} userId - User's MongoDB ID
   * @returns {Promise<Number>} Count of favorites
   */
  async countByUserId(userId) {
    return await Favorite.countDocuments({ userId });
  }

  /**
   * Get a single favorite by user and book
   * @param {String} userId - User's MongoDB ID
   * @param {String} googleBookId - Google Books API ID
   * @returns {Promise<Object|null>} Favorite document or null
   */
  async findByUserAndBook(userId, googleBookId) {
    return await Favorite.findOne({ userId, googleBookId });
  }
}

module.exports = new FavoriteRepository();