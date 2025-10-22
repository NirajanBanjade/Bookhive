// backend/controllers/notificationController.js
const NotificationService = require('../services/NotificationService');

function getAuthUserId(req) {
  return req.user?.id || req.user?._id || null;
}

function parsePage(str) {
  const n = parseInt(str ?? '1', 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

function parseLimit(str) {
  const n = parseInt(str ?? '20', 10);
  const safe = Number.isFinite(n) && n > 0 ? n : 20;
  return Math.min(50, safe);
}

function parseUnread(str) {
  const v = (str ?? '').toString().toLowerCase();
  if (v === 'true') return true;
  if (v === 'false') return false;
  return null; // no filter
}

/**
 * GET /api/notifications
 * Query: ?unread=true|false&page=1&limit=20
 */
async function list(req, res) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const page = parsePage(req.query.page);
    const limit = parseLimit(req.query.limit);
    const unread = parseUnread(req.query.unread);

    const result = await NotificationService.listByUser({
      userId,
      unread,
      page,
      limit,
    });

    return res.json(result);
  } catch (err) {
    console.error('GET /api/notifications failed:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Marks a single notification as read for the authenticated user.
 */
async function markRead(req, res) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params || {};
    if (!id) return res.status(400).json({ message: 'Notification id is required' });

    const updated = await NotificationService.markRead({ id, userId });
    if (!updated) return res.status(404).json({ message: 'Notification not found' });

    return res.json(updated);
  } catch (err) {
    console.error(`PATCH /api/notifications/${req.params?.id}/read failed:`, err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

/**
 * PATCH /api/notifications/read-all
 * Marks all notifications as read for the authenticated user.
 */
async function markAllRead(req, res) {
  try {
    const userId = getAuthUserId(req);
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const result = await NotificationService.markAllRead({ userId });
    return res.json({ ok: true, ...result });
  } catch (err) {
    console.error('PATCH /api/notifications/read-all failed:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports = { list, markRead, markAllRead };
