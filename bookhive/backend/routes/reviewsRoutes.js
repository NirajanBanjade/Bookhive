const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

// POST /api/reviews - Create a review
router.post('/', reviewsController.createReview);

// PUT /api/reviews/:id - Update a review (ownership validated)
router.put('/:id', reviewsController.updateReview);

// DELETE /api/reviews/:id - Delete a review (ownership validated)
router.delete('/:id', reviewsController.deleteReview);

// GET /api/reviews?userId=... - Get reviews by user (query param)
// This MUST come before /:googleBookId to avoid conflicts
router.get('/', reviewsController.listReviews);

// GET /api/reviews/:googleBookId - Get reviews by book
router.get('/:googleBookId', reviewsController.getReviewsByBook);

module.exports = router;