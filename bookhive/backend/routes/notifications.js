const express = require('express');
const router = express.Router();
const { list, markRead, markAllRead } = require('../controllers/notificationController');
const NotificationService = require('../services/NotificationService');
const auth = require('../middleware/jwt_auth');

// GET /api/notifications → list user notifications
router.get('/', auth, list);

// PATCH /api/notifications/:id/read → mark single notification as read
router.patch('/:id/read', auth, markRead);

// PATCH /api/notifications/read-all → mark all notifications as read
router.patch('/read-all', auth, markAllRead);

// POST /api/notifications/hooks/to-read → create "To-Read" notification (KAN-69)
router.post('/hooks/to-read', async (req, res) => {
  try {
    const { recipientId, actorId, bookId, bookTitle } = req.body || {};
    if (!recipientId || !bookId) {
      return res.status(400).json({ error: 'recipientId and bookId are required' });
    }

    const doc = await NotificationService.createToReadAdded({
      recipientId,
      actorId,
      bookId,
      bookTitle,
    });

    return res.status(201).json(doc);
  } catch (err) {
    console.error('KAN-69 /hooks/to-read failed:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
