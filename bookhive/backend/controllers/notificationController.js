// backend/controllers/notificationController.js
const NotificationService = require("../services/NotificationService");

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

module.exports = { list };
