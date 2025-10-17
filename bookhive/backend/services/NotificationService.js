// backend/services/NotificationService.js
const NotificationRepo = require("../repositories/NotificationRepository");

class NotificationService {
  /**
   * List notifications for a user with pagination and optional unread filter.
   * Keeps orchestration here; all DB details live in the repository.
   */
  async listByUser({ userId, unread = null, page = 1, limit = 20 } = {}) {
    if (!userId) {
      throw new Error("listByUser requires userId");
    }

    // Coerce query params safely here (service boundary)
    const safeUnread =
      unread === true || unread === false ? unread : null;

    return NotificationRepo.findPaginated({
      userId,
      unread: safeUnread,
      page,
      limit,
      // Open for extension: sort/projection can be overridden later without changing callers
      sort: { createdAt: -1 },
      projection: null,
    });
  }
}

module.exports = new NotificationService();
module.exports.NotificationService = NotificationService; // for testing/DI
