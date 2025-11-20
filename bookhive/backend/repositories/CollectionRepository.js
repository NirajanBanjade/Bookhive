// backend/repositories/CollectionRepository.js
const { Types } = require('mongoose');
const Collection = require('../models/Collection');

/**
 * Repository for Collection model - handles all database operations
 * Follows pattern established by NotificationRepository and ReviewRepository
 */
class CollectionRepository {
  constructor(model = Collection) {
    this.Collection = model;
  }

  // Helper: validate and convert to ObjectId
  #oid(id) {
    if (!Types.ObjectId.isValid(id)) return null;
    return new Types.ObjectId(id);
  }

  /**
   * Find collection by userId
   * @param {string} userId 
   * @returns {Promise<Object|null>}
   */
  async findByUserId(userId) {
    return this.Collection.findOne({ userId }).lean();
  }

  /**
   * Get books by status for a user
   * @param {string} userId 
   * @param {string} status 
   * @returns {Promise<Array>} List of books with given status
   */
  async getBooksByStatus(userId, status) {
    const collection = await this.findByUserId(userId);
    if (!collection) return [];
    return (collection?.books ?? []).filter((b) => b.status === status);
  }

  /**
   * Create a new collection
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  async create(data) {
    return this.Collection.create(data);
  }

  /**
   * Find or create a collection for a user
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async findOrCreate(userId) {
    let collection = await this.findByUserId(userId);
    if (!collection) {
      collection = await this.create({ userId, books: [] });
    }
    return collection;
  }

  /**
   * Add a book to user's collection
   * @param {string} userId 
   * @param {Object} bookData 
   * @returns {Promise<Object>}
   */
  async addBook(userId, bookData) {
    return this.Collection.findOneAndUpdate(
      { userId },
      { $push: { books: bookData } },
      { new: true, upsert: true }
    ).lean();
  }

  /**
   * Update book status in collection
   * @param {string} userId 
   * @param {string} googleBookId 
   * @param {string} status 
   * @returns {Promise<Object|null>}
   */
  async updateBookStatus(userId, googleBookId, status) {
    return this.Collection.findOneAndUpdate(
      { userId, 'books.googleBookId': googleBookId },
      { $set: { 'books.$.status': status } },
      { new: true }
    ).lean();
  }

  /**
   * Remove a book from collection
   * @param {string} userId 
   * @param {string} googleBookId 
   * @returns {Promise<Object|null>}
   */
  async removeBook(userId, googleBookId) {
    return this.Collection.findOneAndUpdate(
      { userId },
      { $pull: { books: { googleBookId } } },
      { new: true }
    ).lean();
  }

  /**
   * Check if book exists in user's collection
   * @param {string} userId 
   * @param {string} googleBookId 
   * @returns {Promise<boolean>}
   */
  async bookExists(userId, googleBookId) {
    const collection = await this.Collection.findOne(
      { userId, 'books.googleBookId': googleBookId },
      { _id: 1 }
    ).lean();
    return !!collection;
  }

  /**
   * Get a specific book from collection
   * @param {string} userId 
   * @param {string} googleBookId 
   * @returns {Promise<Object|null>} Book object or null
   */
  async findBook(userId, googleBookId) {
    const collection = await this.Collection.findOne(
      { userId, 'books.googleBookId': googleBookId }
    ).lean();
    
    if (!collection) return null;
    
    return collection.books.find(b => b.googleBookId === googleBookId) || null;
  }

  /**
   * Save collection (for manual updates)
   * @param {Object} collection - Mongoose document
   * @returns {Promise<Object>}
   */
  async save(collection) {
    return collection.save();
  }

  /**
   * Delete entire collection for a user (admin/cleanup)
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async deleteByUserId(userId) {
    const result = await this.Collection.deleteOne({ userId });
    return { deletedCount: result.deletedCount };
  }

}

module.exports = new CollectionRepository();
module.exports.CollectionRepository = CollectionRepository; // for tests/DI