// backend/repositories/ToReadRepository.js
const { Types } = require('mongoose');
const ToRead = require('../models/ToRead');

/**
 * Repository for ToRead model - handles all database operations
 * SRP: Only handles database access for ToRead
 * 
 * BACKWARDS COMPATIBLE:
 * - Supports old constructor: new ToReadRepository({ ToReadModel: ToRead })
 * - Supports new constructor: new ToReadRepository(ToRead)
 * - Supports old export: const { ToReadRepository } = require(...)
 * - Supports new export: const ToReadRepo = require(...) [singleton]
 */
class ToReadRepository {
  constructor(modelOrConfig = ToRead) {
    // Support both old pattern ({ ToReadModel: ToRead }) and new pattern (ToRead)
    if (modelOrConfig && typeof modelOrConfig === 'object' && modelOrConfig.ToReadModel) {
      // Old pattern from teammate: { ToReadModel: ToRead }
      this.ToRead = modelOrConfig.ToReadModel;
    } else {
      // New pattern: direct model or default
      this.ToRead = modelOrConfig;
    }
  }

  // Helper: validate and convert to ObjectId
  #oid(id) {
    if (!Types.ObjectId.isValid(id)) return null;
    return new Types.ObjectId(id);
  }

  /**
   * ORIGINAL METHOD - kept for backwards compatibility
   * Fetches the "to read" list for a user
   * @param {string} userId 
   * @returns {Promise<Array>} Array of books
   */
  async getBooksForUser(userId) {
    const doc = await this.ToRead.findOne({ userId });
    return doc?.books ?? [];
  }

  /**
   * Find to-read list by userId
   * @param {string} userId 
   * @returns {Promise<Object|null>}
   */
  async findByUserId(userId) {
    return this.ToRead.findOne({ userId }).lean();
  }

  /**
   * Create a new to-read list
   * @param {Object} data 
   * @returns {Promise<Object>}
   */
  async create(data) {
    return this.ToRead.create(data);
  }

  /**
   * Find or create a to-read list for a user
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async findOrCreate(userId) {
    let list = await this.findByUserId(userId);
    if (!list) {
      list = await this.create({ userId, books: [] });
    }
    return list;
  }

  /**
   * Add a book to user's to-read list
   * @param {string} userId 
   * @param {Object} bookData 
   * @returns {Promise<Object>}
   */
  async addBook(userId, bookData) {
    return this.ToRead.findOneAndUpdate(
      { userId },
      { $push: { books: bookData } },
      { new: true, upsert: true }
    ).lean();
  }

  /**
   * Remove a book from to-read list
   * @param {string} userId 
   * @param {string} googleBookId 
   * @returns {Promise<Object|null>}
   */
  async removeBook(userId, googleBookId) {
    return this.ToRead.findOneAndUpdate(
      { userId },
      { $pull: { books: { googleBookId } } },
      { new: true }
    ).lean();
  }

  /**
   * Check if book exists in user's to-read list
   * @param {string} userId 
   * @param {string} googleBookId 
   * @returns {Promise<boolean>}
   */
  async bookExists(userId, googleBookId) {
    const list = await this.ToRead.findOne(
      { userId, 'books.googleBookId': googleBookId },
      { _id: 1 }
    ).lean();
    return !!list;
  }

  /**
   * Get a specific book from to-read list
   * @param {string} userId 
   * @param {string} googleBookId 
   * @returns {Promise<Object|null>} Book object or null
   */
  async findBook(userId, googleBookId) {
    const list = await this.ToRead.findOne(
      { userId, 'books.googleBookId': googleBookId }
    ).lean();
    
    if (!list) return null;
    
    return list.books.find(b => b.googleBookId === googleBookId) || null;
  }

  /**
   * Search books in to-read list with pagination
   * Uses MongoDB aggregation for complex queries
   * @param {Object} params
   * @param {string} params.userId 
   * @param {string} [params.query] - Search query
   * @param {number} [params.page=1] 
   * @param {number} [params.limit=10] 
   * @returns {Promise<Object>} Paginated results
   */
  async searchBooks({ userId, query = '', page = 1, limit = 10 } = {}) {
    const skip = (page - 1) * limit;

    const keywordMatch = query
      ? {
          $or: [
            { 'books.title': { $regex: query, $options: 'i' } },
            { 'books.authors': { $elemMatch: { $regex: query, $options: 'i' } } },
          ],
        }
      : {};

    const pipeline = [
      { $match: { userId } },
      { $unwind: '$books' },
      ...(query ? [{ $match: keywordMatch }] : []),
      {
        $facet: {
          data: [
            { $sort: { 'books.title': 1, _id: 1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: 0,
                googleBookId: '$books.googleBookId',
                title: '$books.title',
                authors: '$books.authors',
                thumbnail: '$books.thumbnail',
                categories: '$books.categories'
              },
            },
          ],
          totalDocs: [{ $count: 'count' }],
        },
      },
    ];

    const result = await this.ToRead.aggregate(pipeline).exec();
    const data = result[0]?.data ?? [];
    const total = result[0]?.totalDocs?.[0]?.count ?? 0;

    return {
      data,
      page,
      limit,
      total,
      hasNext: skip + data.length < total,
      hasPrev: page > 1,
    };
  }

  /**
   * Update to-read list
   * @param {string} userId 
   * @param {Object} updateData 
   * @returns {Promise<Object>}
   */
  async updateOne(userId, updateData) {
    return this.ToRead.updateOne({ userId }, updateData);
  }

  /**
   * Delete entire to-read list for a user
   * @param {string} userId 
   * @returns {Promise<Object>}
   */
  async deleteByUserId(userId) {
    const result = await this.ToRead.deleteOne({ userId });
    return { deletedCount: result.deletedCount };
  }
}

// Export as singleton (new pattern - matches ReviewRepository)
module.exports = new ToReadRepository();

// Also export class (old pattern - for backwards compatibility and testing)
// module.exports.ToReadRepository = ToReadRepository;