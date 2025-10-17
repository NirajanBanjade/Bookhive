// backend/controllers/notificationController.js
const NotificationService = require("../services/NotificationService");

/**
 * GET /api/notifications
 * Query: ?unread=true|false&page=1&limit=20
 */
async function list(req, res) {
  try {
    const userId = req.user?.id || req.user?._id; // depends on your auth middleware
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const page = Math.max(1, parseInt(req.query.page ?? "1", 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit ?? "20", 10) || 20));
    const unreadParam = (req.query.unread ?? "").toString().toLowerCase();
    const unread =
      unreadParam === "true" ? true : unreadParam === "false" ? false : null;

    const result = await NotificationService.listByUser({
      userId,
      unread,
      page,
      limit,
    });

    return res.json(result);
  } catch (err) {
    console.error("GET /api/notifications failed:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * PATCH /api/notifications/:id/read
 * Marks a single notification as read for the authenticated user.
 */
async function markRead(req, res) {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Notification id is required" });

    const updated = await NotificationService.markRead({ id, userId });
    if (!updated) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.json(updated);
  } catch (err) {
    console.error(`PATCH /api/notifications/${req.params?.id}/read failed:`, err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

/**
 * PATCH /api/notifications/read-all
 * Marks all notifications as read for the authenticated user.
 */
async function markAllRead(req, res) {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const result = await NotificationService.markAllRead({ userId });
    return res.json({ ok: true, ...result });
  } catch (err) {
    console.error("PATCH /api/notifications/read-all failed:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { list, markRead, markAllRead };
