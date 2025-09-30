const express = require('express');
const router = express.Router();
const { getToReadList, searchToReadBooks } = require('../controllers/toReadController');

router.get('/:userId', getToReadList);
router.get('/:userId/search', searchToReadBooks);

module.exports = router;
