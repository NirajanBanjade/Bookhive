const express = require('express');
const router = express.Router();
const collectionsController = require('../controllers/collectionsController');

router.get('/:userId', collectionsController.getCollectionsList);
router.post('/:userId', collectionsController.addBookToCollections);
router.put('/:userId/books/:googleBookId/status', collectionsController.updateBookStatus);
router.patch('/:userId/:googleBookId', collectionsController.updateBookStatus); // NEW: Add PATCH route
router.delete('/:userId/books/:googleBookId', collectionsController.removeBookFromCollections);
router.delete('/:userId/:googleBookId', collectionsController.removeBookFromCollections); // NEW: Alternative delete route
// router.put('/:userId/books/:googleBookId/review', collectionsController.addReview); // KAN-60: Future review support
// router.get('/:userId/stats', collectionsController.getProfileStats); // KAN-60: Future profile stats

module.exports = router;