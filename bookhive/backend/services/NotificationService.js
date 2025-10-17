// backend/services/NotificationService.js
const Notification = require("../models/Notification");

async function listByUser({ userId, unread, page = 1, limit = 20 }) {
  const filter = { userId };
  if (unread === true) filter.read = false;

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Notification.countDocuments(filter),
  ]);

  return {
    items,
    page,
    limit,
    total,
    hasMore: skip + items.length < total,
  };
}

module.exports = {
  listByUser,
};
