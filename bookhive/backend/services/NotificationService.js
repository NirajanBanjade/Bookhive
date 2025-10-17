// backend/services/NotificationService.js
const NotificationRepo = require("../repositories/NotificationRepository");

class NotificationService {
  async listByUser({ userId, unread = null, page = 1, limit = 20 } = {}) {
    if (!userId) throw new Error("listByUser requires userId");
    const safeUnread = unread === true || unread === false ? unread : null;

    return NotificationRepo.findPaginated({
      userId,
      unread: safeUnread,
      page,
      limit,
      sort: { createdAt: -1 },
      projection: null,
    });
  }

  /**
   * Mark a single notification as read (user-scoped).
   */
  async markRead({ id, userId }) {
    if (!id) throw new Error("markRead requires id");
    if (!userId) throw new Error("markRead requires userId");

    const updated = await NotificationRepo.markAsRead(id, userId);
    return updated; // null if not found or not owned by user
  }
}

module.exports = new NotificationService();
module.exports.NotificationService = NotificationService; // for tests/DI
