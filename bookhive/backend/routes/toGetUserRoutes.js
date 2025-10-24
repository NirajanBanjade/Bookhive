const express = require('express');
const router = express.Router();

const { registerUser, loginUser } = require('../controllers/toGetUserController');
const auth = require('../middleware/jwt_auth'); // ← add this

router.post('/register', registerUser);
router.post('/login', loginUser);

// NEW: get current authenticated user
router.get('/me', auth, async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // If you want full user info, fetch it here:
    // const User = require('../models/User');
    // const doc = await User.findById(req.user.id).select('_id username email role createdAt');
    // if (!doc) return res.status(404).json({ message: 'User not found' });
    // return res.json({ user: doc });

    // Minimal (from token only), works fine for our seeding step:
    return res.json({ user: { id: req.user.id } });
  } catch (err) {
    console.error('GET /me failed:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
