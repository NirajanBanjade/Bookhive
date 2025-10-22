// backend/services/NotificationService.js
const NotificationRepo = require('../repositories/NotificationRepository');

/**
 * Orchestrates notification operations.
 * SRP: no DB code here (delegates to repository).
 * OCP: methods accept extensible options (sort/projection later if needed).
 */
class NotificationService {
  /**
   * List notifications for a user with pagination and optional unread filter.
   * @param {Object} params
   * @param {string|ObjectId} params.userId
   * @param {boolean|null} [params.unread] - true | false | null(no filter)
   * @param {number} [params.page=1]
   * @param {number} [params.limit=20]
   */
  async listByUser({ userId, unread = null, page = 1, limit = 20 } = {}) {
    if (!userId) throw new Error('listByUser requires userId');
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
   * @param {Object} params
   * @param {string} params.id
   * @param {string|ObjectId} params.userId
   */
  async markRead({ id, userId }) {
    if (!id) throw new Error('markRead requires id');
    if (!userId) throw new Error('markRead requires userId');
    return NotificationRepo.markAsRead(id, userId); // null if not found/not owned
  }

  /**
   * Mark all notifications as read for a user (bulk).
   * @param {Object} params
   * @param {string|ObjectId} params.userId
   */
  async markAllRead({ userId }) {
    if (!userId) throw new Error('markAllRead requires userId');
    return NotificationRepo.markAllAsRead(userId); // { matched, modified }
  }

  /**
   * Create a notification record.
   * Keeps validation/normalization here; repo handles persistence.
   * @param {Object} data
   * @param {string|ObjectId} data.toUserId
   * @param {string} data.message
   * @param {"info"|"success"|"warning"} [data.type="info"]
   * @param {string|ObjectId} [data.actorId]
   * @param {string} [data.eventType] - e.g., "TO_READ_ADDED"
   * @param {string} [data.entityType] - e.g., "BOOK", "COMMENT"
   * @param {string} [data.entityId]
   * @param {Object} [data.metadata={}]
   */
  async createNotification(data) {
    const {
      toUserId,
      message,
      type = 'info',
      actorId = null,
      eventType = null,
      entityType = null,
      entityId = null,
      metadata = {},
    } = data || {};

    if (!toUserId) throw new Error('createNotification requires toUserId');
    if (!message) throw new Error('createNotification requires message');

    return NotificationRepo.create({
      userId: toUserId,
      message,
      type,
      actorId,
      eventType,
      entityType,
      entityId,
      metadata,
    });
  }

  /**
   * Shortcut for KAN-69: create "To-Read added" notification.
   * Uses existing normalization/validation from createNotification.
   * @param {Object} p
   * @param {string|ObjectId} p.recipientId
   * @param {string|ObjectId} [p.actorId]
   * @param {string} p.bookId
   * @param {string} [p.bookTitle]
   */
  async createToReadAdded({ recipientId, actorId = null, bookId, bookTitle }) {
    const message = bookTitle
      ? `Added "${bookTitle}" to To-Read list`
      : 'Added a book to To-Read list';

    return this.createNotification({
      toUserId: recipientId,
      message,
      type: 'info',
      actorId,
      eventType: 'TO_READ_ADDED',
      entityType: 'BOOK',
      entityId: bookId,
      metadata: { bookId, bookTitle },
    });
  }
}

module.exports = new NotificationService();
module.exports.NotificationService = NotificationService; // for tests/DI
