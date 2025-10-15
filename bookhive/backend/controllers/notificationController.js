const NotificationService = require("../services/NotificationService");

module.exports = {
  async list(req, res) {
    try {
      const { userId, limit } = req.query;
      const items = await NotificationService.listForUser(userId, Number(limit) || 20);
      res.json({ items });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  // POST /api/notifications/:id/read
  async markRead(req, res) {
    try {
      const { id } = req.params;
      const updated = await NotificationService.markAsRead(id);
      res.json({ ok: true, item: updated });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  // POST /api/notifications/read-all  { userId: "..." }
  async markAllRead(req, res) {
    try {
      const { userId } = req.body;
      await NotificationService.markAllAsRead(userId);
      res.json({ ok: true });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },
};
