const express = require('express');
const router = express.Router();
const { toUserProfile } = require('../controllers/toUserProfile');

const authMiddleware = require('../middleware/jwt_auth');

router.get('/profile', authMiddleware, toUserProfile);

module.exports = router;