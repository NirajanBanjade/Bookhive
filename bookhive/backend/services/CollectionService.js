// backend/services/CollectionService.js
const CollectionRepo = require('../repositories/CollectionRepository');
const StatusManager = require('./StatusManager');
const NotificationService = require('./NotificationService');

/**
 * Service for Collection business logic
 * Delegates database operations to CollectionRepository
 */
class CollectionService {

  /**
   * Get user's collection list
   * @param {string} userId 
   * @returns {Promise<Object>} Collection or empty collection
   */
  async getCollectionsList(userId) {
    const list = await CollectionRepo.findByUserId(userId);
    return list || { userId, books: [] };
  }

  /**
   * Validate required book fields
   */
  validateBookData(googleBookId, title) {
    if (!googleBookId || !title) {
      throw new Error('googleBookId and title are required');
    }
  }

  /**
   * Add a book to user's collection
   * @param {string} userId 
   * @param {Object} bookData - Book information
   * @returns {Promise<Object>} Updated collection
   */
  async addBookToCollections(userId, bookData) {
    const { googleBookId, title, authors = [], thumbnail, categories = [] } = bookData;

    // Validate required fields
    this.validateBookData(googleBookId, title);

    // Check if book already exists
    const exists = await CollectionRepo.bookExists(userId, googleBookId);
    if (exists) {
      // Return existing collection without error
      return this.getCollectionsList(userId);
    }

    // Add book to collection
    const collection = await CollectionRepo.addBook(userId, { 
      googleBookId, 
      title, 
      authors, 
      thumbnail, 
      categories 
    });

    // Notify user
    await NotificationService.createBookAddedToCollectionNotification(userId, title);

    return collection;
  }

  /**
   * Update book status in collection
   * @param {string} userId 
   * @param {string} googleBookId 
   * @param {string} newStatus 
   * @returns {Promise<Object>} Updated collection
   */
  async updateBookStatus(userId, googleBookId, newStatus) {
    // Validate status using StatusManager
    StatusManager.validateStatus(newStatus);
    
    // Check if collection exists
    const collection = await CollectionRepo.findByUserId(userId);
    if (!collection) {
      throw new Error('Collection not found');
    }
    
    // Check if book exists in collection
    const book = collection.books.find(b => b.googleBookId === googleBookId);
    if (!book) {
      throw new Error('Book not found in collection');
    }
    
    // Update status via repository
    const updatedCollection = await CollectionRepo.updateBookStatus(
      userId, 
      googleBookId, 
      newStatus
    );
    
    // Notify with proper label
    const statusLabel = StatusManager.getStatusLabel(newStatus);
    await NotificationService.createStatusChangeNotification(
      userId, 
      book.title, 
      statusLabel
    );
    
    return updatedCollection;
  }

  /**
   * Remove a book from user's collection
   * @param {string} userId 
   * @param {string} googleBookId 
   * @returns {Promise<Object>} Updated collection
   */
  async removeBookFromCollections(userId, googleBookId) {
    // Get collection first to extract book info
    const collection = await CollectionRepo.findByUserId(userId);
    if (!collection) {
      throw new Error('User collection not found');
    }

    // Find book for notification
    const bookToRemove = collection.books.find(b => b.googleBookId === googleBookId);
    if (!bookToRemove) {
      throw new Error('Book not found in collection');
    }

    // Remove book via repository
    const updatedCollection = await CollectionRepo.removeBook(userId, googleBookId);

    // Notify user
    await NotificationService.createBookRemovedFromCollectionNotification(
      userId, 
      bookToRemove.title
    );

    return updatedCollection;
  }

}

module.exports = new CollectionService();
module.exports.CollectionService = CollectionService; // for tests/DI