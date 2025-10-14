const Notification = require("../models/Notification");

class NotificationRepository {
  // Create a new notification
  async create(data) {
    return await Notification.create(data);
  }

  async findByUser(userId, limit = 20) {
    return await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  }

  // Mark one notification as read
  async markAsRead(id) {
    return await Notification.findByIdAndUpdate(
      id,
      { read: true, readAt: new Date() },
      { new: true }
    );
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    return await Notification.updateMany(
      { userId, read: false },
      { $set: { read: true, readAt: new Date() } }
    );
  }
}

module.exports = new NotificationRepository();
