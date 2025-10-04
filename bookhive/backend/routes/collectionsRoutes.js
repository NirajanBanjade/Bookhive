const express = require('express');
const router = express.Router();
const collectionsController = require('../controllers/collectionsController');

router.get('/:userId', collectionsController.getCollectionsList);
router.post('/:userId', collectionsController.addBookToCollections);

module.exports = router;
