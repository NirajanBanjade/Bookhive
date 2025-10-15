const repo = require("../repositories/NotificationRepository");

class NotificationService {
  /**
   * Create a notification
   * @param {Object} params
   * @param {string} params.userId       - who receives the notification (required)
   * @param {string} [params.actorId]    - who triggered it
   * @param {string} [params.eventType]  - domain event type (e.g., TO_READ_ADDED, MENTION)
   * @param {string} [params.entityType] - e.g., BOOK, COMMENT
   * @param {string} [params.entityId]   - e.g., GoogleBookId or CommentId
   * @param {string} params.message      - text to display (required)
   * @param {Object} [params.metadata]   - extra info for routing/UI
   * @param {('info'|'success'|'warning')} [params.type='info'] - UI category (kept from your schema)
   */
  async create({
    userId,
    actorId,
    eventType,
    entityType,
    entityId,
    message,
    metadata = {},
    type = "info",
  }) {
    if (!userId || !message) {
      throw new Error("userId and message are required to create a notification");
    }

    return await repo.create({
      userId,
      actorId,
      eventType,
      entityType,
      entityId,
      message,
      metadata,
      type,
    });
  }

  /**
   * List notifications for a user (newest first)
   * @param {string} userId
   * @param {number} [limit=20]
   */
  async listForUser(userId, limit = 20) {
    if (!userId) throw new Error("userId is required");
    return await repo.findByUser(userId, limit);
  }

  /**
   * Mark a single notification as read
   * @param {string} id - notification id
   */
  async markAsRead(id) {
    if (!id) throw new Error("notification id is required");
    return await repo.markAsRead(id);
  }

  /**
   * Mark all notifications as read for a user
   * @param {string} userId
   */
  async markAllAsRead(userId) {
    if (!userId) throw new Error("userId is required");
    return await repo.markAllAsRead(userId);
  }
}

module.exports = new NotificationService();
