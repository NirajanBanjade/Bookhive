// backend/repositories/ReviewRepository.js
const { Types } = require('mongoose');
const Review = require('../models/Review');

/**
 * Repository for Review model - handles all database operations
 * Follows pattern established by NotificationRepository
 */
class ReviewRepository {
  constructor(model = Review) {
    this.Review = model;
  }

  // Helper: validate and convert to ObjectId
  #oid(id) {
    if (!Types.ObjectId.isValid(id)) return null;
    return new Types.ObjectId(id);
  }

  /**
   * Create a new review
   */
  async create(data) {
    return this.Review.create(data);
  }

  /**
   * Find a single review by query
   */
  async findOne(query) {
    return this.Review.findOne(query).lean();
  }

  /**
   * Find reviews by user or book with pagination
   * @param {Object} params
   * @param {string} [params.userId] - Filter by user
   * @param {string} [params.googleBookId] - Filter by book
   * @param {number} [params.limit=50] - Max results
   * @param {Object} [params.sort] - Sort order
   */
  async find({ userId, googleBookId, limit = 50, sort = { reviewedAt: -1 } } = {}) {
    const query = {};
    if (userId) query.userId = userId;
    if (googleBookId) query.googleBookId = googleBookId;

    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 50));

    return this.Review.find(query)
      .sort(sort)
      .limit(safeLimit)
      .lean();
  }

  /**
   * Find reviews by book with higher limit
   */
  async findByBook(googleBookId, limit = 100) {
    if (!googleBookId) throw new Error('googleBookId is required');
    
    return this.Review.find({ googleBookId })
      .sort({ reviewedAt: -1 })
      .limit(limit)
      .lean();
  }

  /**
   * Update a review by ID
   */
  async updateById(id, updateData) {
    const _id = this.#oid(id);
    if (!_id) return null;
    
    return this.Review.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();
  }

  /**
   * Delete a review by ID
   */
  async deleteById(id) {
    const _id = this.#oid(id);
    if (!_id) return null;
    
    return this.Review.findByIdAndDelete(_id).lean();
  }

  /**
   * Find review by ID
   */
  async findById(id) {
    const _id = this.#oid(id);
    if (!_id) return null;
    
    return this.Review.findById(_id).lean();
  }

  /**
   * Check if review exists
   */
  async exists(userId, googleBookId) {
    const count = await this.Review.countDocuments({ userId, googleBookId });
    return count > 0;
  }

  /**
   * Delete all reviews for a book (admin/cleanup function)
   */
  async deleteByBook(googleBookId) {
    const result = await this.Review.deleteMany({ googleBookId });
    return { deletedCount: result.deletedCount };
  }

  /**
   * Delete all reviews by a user (admin/cleanup function)
   */
  async deleteByUser(userId) {
    const result = await this.Review.deleteMany({ userId });
    return { deletedCount: result.deletedCount };
  }

}

module.exports = new ReviewRepository();
module.exports.ReviewRepository = ReviewRepository; // for tests/DI