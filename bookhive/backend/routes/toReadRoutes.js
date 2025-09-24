const express = require('express');
const router = express.Router();
const { getToReadList } = require('../controllers/toReadController');

router.get('/:userId', getToReadList);

module.exports = router;
