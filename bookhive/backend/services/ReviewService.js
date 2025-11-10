// backend/services/ReviewService.js
const ReviewRepo = require('../repositories/ReviewRepository');
const Collection = require('../models/Collection');
const NotificationService = require('./NotificationService');

/**
 * Service for Review business logic
 * Delegates database operations to ReviewRepository
 */
class ReviewService {

  // ============= VALIDATION METHODS =============

  /**
   * Validate required fields for review creation
   */
  validateRequiredFields(userId, googleBookId, rating) {
    if (!userId || !googleBookId || !rating) {
      throw new Error('userId, googleBookId, and rating are required');
    }
  }

  /**
   * Validate rating is within acceptable range
   */
  validateRating(rating) {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5');
    }
  }

  /**
   * Validate book exists in user's collection and return book title
   * @returns {Promise<string>} - Book title
   */
  async validateBookInCollection(userId, googleBookId) {
    const collection = await Collection.findOne({ 
      userId, 
      'books.googleBookId': googleBookId 
    });
    
    if (!collection) {
      throw new Error('Book must be in your collection to review');
    }
    
    const book = collection.books.find(b => b.googleBookId === googleBookId);
    return book?.title || 'this book';
  }

  /**
   * Check if user has already reviewed this book
   */
  async checkDuplicateReview(userId, googleBookId) {
    const exists = await ReviewRepo.exists(userId, googleBookId);
    if (exists) {
      throw new Error('You have already reviewed this book');
    }
  }

// ============= BUSINESS METHODS =============

  /**
   * Create a new review
   * @param {string} userId 
   * @param {string} googleBookId 
   * @param {number} rating 
   * @param {string} comment 
   * @returns {Promise<Object>} Created review
   */
  async createReview(userId, googleBookId, rating, comment) {
    // Validation
    this.validateRequiredFields(userId, googleBookId, rating);
    this.validateRating(rating);
    
    // Business rules
    const bookTitle = await this.validateBookInCollection(userId, googleBookId);
    await this.checkDuplicateReview(userId, googleBookId);
    
    // Create review via repository
    const review = await ReviewRepo.create({ 
      userId, 
      googleBookId, 
      rating, 
      comment 
    });
    
    // Notify user
    await NotificationService.createReviewNotification(userId, bookTitle, rating);
    
    return review;
  }

  /**
   * List reviews by user or book
   * @param {string} userId - Optional user filter
   * @param {string} googleBookId - Optional book filter
   * @returns {Promise<Array>} List of reviews
   */
  async listReviews(userId, googleBookId) {
    if (!userId && !googleBookId) {
      throw new Error('userId or googleBookId is required');
    }

    return ReviewRepo.find({ 
      userId, 
      googleBookId, 
      limit: 50 
    });
  }

  /**
   * Get all reviews for a specific book
   * @param {string} googleBookId 
   * @returns {Promise<Array>} List of reviews
   */
  async getReviewsByBook(googleBookId) {
    if (!googleBookId) {
      throw new Error('googleBookId is required');
    }

    return ReviewRepo.findByBook(googleBookId, 100);
  }

  /**
   * Delete a review and notify user
   * @param {string} reviewId 
   * @param {string} userId - For ownership verification
   * @returns {Promise<Object>} Deletion result
   */
  async deleteReview(reviewId, userId) {
    // Get review first to extract book info
    const review = await ReviewRepo.findById(reviewId);

    if (!review) {
      throw new Error('Review not found');
    }

    // Get book title for notification
    const collection = await Collection.findOne({ 
      userId: review.userId, 
      'books.googleBookId': review.googleBookId 
    });
    const book = collection?.books.find(b => b.googleBookId === review.googleBookId);
    const bookTitle = book?.title || 'a book';

    // Delete review
    await ReviewRepo.deleteById(reviewId);

    // Notify user
    await NotificationService.createReviewDeletedNotification(review.userId, bookTitle);

    return { message: 'Review deleted', bookTitle };
  }
}

module.exports = new ReviewService();
module.exports.ReviewService = ReviewService; // for tests/DI