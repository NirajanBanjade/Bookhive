// backend/controllers/reviewController.js
const ReviewService = require('../services/ReviewService');

// Create a review (only for books in Collection)
exports.createReview = async (req, res) => {
  try {
    const { userId, googleBookId, rating, comment } = req.body;
    
    const review = await ReviewService.createReview(userId, googleBookId, rating, comment);
    
    res.status(201).json(review);
  } catch (err) {
    console.error('Error creating review:', err);
    
    if (err.message.includes('required') || 
        err.message.includes('Rating must') ||
        err.message.includes('collection') ||
        err.message.includes('already reviewed')) {
      return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// List reviews (by user or book)
exports.listReviews = async (req, res) => {
  try {
    const { userId, googleBookId } = req.query;
    
    const reviews = await ReviewService.listReviews(userId, googleBookId);
    
    res.status(200).json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    
    if (err.message.includes('required')) {
      return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await ReviewService.deleteReview(id);

    res.status(200).json({ message: result.message });
  } catch (err) {
    console.error('Error deleting review:', err);
    
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};

// Get reviews by book
exports.getReviewsByBook = async (req, res) => {
  try {
    const { googleBookId } = req.params;

    const reviews = await ReviewService.getReviewsByBook(googleBookId);

    res.status(200).json({ reviews, count: reviews.length });
  } catch (err) {
    console.error('Error fetching reviews by book:', err);
    
    if (err.message.includes('required')) {
      return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ error: 'Server error' });
  }
};