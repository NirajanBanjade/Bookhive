// backend/repositories/NotificationRepository.js
const { Types } = require("mongoose");
const Notification = require("../models/Notification");

class NotificationRepository {
  constructor(model = Notification) {
    this.Notification = model;
  }

  #oid(id) {
    if (!Types.ObjectId.isValid(id)) return null;
    return new Types.ObjectId(id);
  }

  async create(data) {
    return this.Notification.create(data);
  }

  async createMany(list = []) {
    if (!Array.isArray(list) || list.length === 0) return { insertedCount: 0 };
    const docs = await this.Notification.insertMany(list, { ordered: false });
    return { insertedCount: docs.length, docs };
  }

  async findPaginated({
    userId,
    unread = null,               // true | false | null (no filter)
    page = 1,
    limit = 20,
    sort = { createdAt: -1 },
    projection = null,
  } = {}) {
    const filter = { userId };
    if (unread === true) filter.read = false;
    if (unread === false) filter.read = true;

    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (safePage - 1) * safeLimit;

    const [items, total] = await Promise.all([
      this.Notification.find(filter, projection).sort(sort).skip(skip).limit(safeLimit).lean(),
      this.Notification.countDocuments(filter),
    ]);

    return {
      items,
      page: safePage,
      limit: safeLimit,
      total,
      hasMore: skip + items.length < total,
    };
  }

  // Backward-compatible convenience wrapper
  async findByUser(userId, limit = 20) {
    return this.findPaginated({ userId, page: 1, limit }).then(r => r.items);
  }

  async markAsRead(id, userId) {
    const _id = this.#oid(id);
    if (!_id) return null;
    return this.Notification.findOneAndUpdate(
      { _id, userId },
      { $set: { read: true, readAt: new Date() } },
      { new: true, lean: true }
    );
  }

  async markAllAsRead(userId) {
    const res = await this.Notification.updateMany(
      { userId, read: false },
      { $set: { read: true, readAt: new Date() } }
    );
    return { matched: res.matchedCount ?? res.n, modified: res.modifiedCount ?? res.nModified };
  }
}

module.exports = new NotificationRepository();
module.exports.NotificationRepository = NotificationRepository; 
