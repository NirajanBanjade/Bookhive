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

  async markRead({ id, userId }) {
    if (!id) throw new Error("markRead requires id");
    if (!userId) throw new Error("markRead requires userId");
    return NotificationRepo.markAsRead(id, userId);
  }

  /**
   * Mark all notifications as read for a user.
   */
  async markAllRead({ userId }) {
    if (!userId) throw new Error("markAllRead requires userId");
    return NotificationRepo.markAllAsRead(userId);
  }
}

module.exports = new NotificationService();
module.exports.NotificationService = NotificationService;
