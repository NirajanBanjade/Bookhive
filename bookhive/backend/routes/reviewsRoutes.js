const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');

// POST /api/reviews - Create a review (no auth for testing)
router.post('/', reviewsController.createReview);

router.get('/:googleBookId', reviewsController.getReviewsByBook);

module.exports = router;