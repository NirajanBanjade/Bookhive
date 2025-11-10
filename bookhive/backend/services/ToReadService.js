// backend/services/ToReadService.js
const ToReadRepo = require('../repositories/ToReadRepository');
const CollectionRepo = require('../repositories/CollectionRepository');
const NotificationService = require('./NotificationService');
const StatusManager = require('./StatusManager');

/**
 * Service for ToRead business logic
 * Delegates database operations to ToReadRepository
 */
class ToReadService {

  /**
   * Get user's to-read list
   * @param {string} userId 
   * @returns {Promise<Object>} To-read list or empty list
   */
  async getToReadList(userId) {
    const list = await ToReadRepo.findByUserId(userId);
    return list || { userId, books: [] };
  }

  /**
   * Search books in to-read list with pagination
   * @param {string} userId 
   * @param {string} query - Search query
   * @param {number} page 
   * @param {number} limit 
   * @returns {Promise<Object>} Paginated search results
   */
  async searchToReadBooks(userId, query = '', page = 1, limit = 10) {
    const result = await ToReadRepo.searchBooks({ 
      userId, 
      query, 
      page, 
      limit 
    });

    // Format response to match controller expectations
    return {
      data: result.data,
      meta: {
        page: result.page,
        limit: result.limit,
        returned: result.data.length,
        total: result.total,
        has_next: result.hasNext,
        has_prev: result.hasPrev,
        next_page: result.hasNext ? page + 1 : null,
        prev_page: result.hasPrev ? page - 1 : null,
        q: query || undefined,
        userId,
      },
    };
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
   * Add a book to user's to-read list
   * Business rules:
   * - Book cannot already be in Collections
   * - Book cannot be duplicate in to-read list
   * 
   * @param {string} userId 
   * @param {Object} bookData 
   * @returns {Promise<Object>} Updated to-read list with isNewAddition flag
   */
  async addBookToToRead(userId, bookData) {
    const { googleBookId, title, authors = [], thumbnail, categories = [] } = bookData;

    // Validate required fields
    this.validateBookData(googleBookId, title);

    // Business rule: Check if book is already in Collections
    const inCollection = await CollectionRepo.bookExists(userId, googleBookId);
    if (inCollection) {
      throw new Error('Book is already in your collection');
    }

    // Check if book already in to-read list
    const inToRead = await ToReadRepo.bookExists(userId, googleBookId);
    if (inToRead) {
      // Return existing list without error (idempotent)
      const list = await this.getToReadList(userId);
      return { list, isNewAddition: false };
    }

    // Add book to to-read list
    const book = { googleBookId, title, authors, thumbnail, categories };
    const list = await ToReadRepo.addBook(userId, book);

    // Notify user
    await NotificationService.createToReadAdded({
      recipientId: userId,
      actorId: userId,
      bookId: googleBookId,
      bookTitle: title,
    });

    return { list, isNewAddition: true };
  }

  /**
   * Remove a book from user's to-read list
   * @param {string} userId 
   * @param {string} googleBookId 
   * @returns {Promise<Object>} Updated to-read list
   */
  async removeBookFromToRead(userId, googleBookId) {
    // Get book info before removal for notification
    const book = await ToReadRepo.findBook(userId, googleBookId);
    
    if (!book) {
      throw new Error('Book not found in to-read list');
    }

    // Remove book via repository
    const updatedList = await ToReadRepo.removeBook(userId, googleBookId);

    // Notify user
    await NotificationService.createBookRemovedFromToReadNotification(
      userId, 
      book.title
    );

    return updatedList;
  }

  /**
   * Move a book from to-read list to collections
   * This orchestrates operations across TWO models (ToRead + Collection)
   * 
   * @param {string} userId 
   * @param {string} googleBookId 
   * @param {string} status - 'currently-reading' or 'completed'
   * @returns {Promise<Object>} Both updated lists
   */
  async moveBookToCollections(userId, googleBookId, status = 'currently-reading') {
    // Validate status using StatusManager
    StatusManager.validateStatus(status);

    // Get book from to-read list
    const book = await ToReadRepo.findBook(userId, googleBookId);
    if (!book) {
      throw new Error('Book not found in to-read list');
    }

    // Check if already in collection (shouldn't happen, but safety check)
    const alreadyInCollection = await CollectionRepo.bookExists(userId, googleBookId);
    if (alreadyInCollection) {
      // Just remove from to-read and return
      await ToReadRepo.removeBook(userId, googleBookId);
      const toRead = await this.getToReadList(userId);
      const collection = await CollectionRepo.findByUserId(userId);
      return {
        message: 'Book already in collection, removed from to-read',
        toRead: toRead.books,
        collections: collection?.books || [],
      };
    }

    // Add to Collections with status
    await CollectionRepo.addBook(userId, { ...book, status });

    // Remove from To-Read
    await ToReadRepo.removeBook(userId, googleBookId);

    // Notify user with proper status label
    const statusLabel = StatusManager.getStatusLabel(status);
    await NotificationService.createBookMovedNotification(
      userId, 
      book.title, 
      statusLabel
    );

    // Return both updated lists
    const updatedToRead = await this.getToReadList(userId);
    const updatedCollection = await CollectionRepo.findByUserId(userId);

    return {
      message: 'Book moved to collections',
      toRead: updatedToRead.books,
      collections: updatedCollection?.books || [],
    };
  }

}

module.exports = new ToReadService();
module.exports.ToReadService = ToReadService; // for tests/DI