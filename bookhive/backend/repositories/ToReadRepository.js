// SRP: Only reads ToRead data for a user
const ToRead = require("../models/ToRead");

class ToReadRepository {
  /**
   * @param {Object} deps
   * @param {typeof ToRead} deps.ToReadModel
   */
  constructor({ ToReadModel = ToRead } = {}) {
    this.ToRead = ToReadModel;
  }

  // Fetches the "to read" list for a user
  async getBooksForUser(userId) {
    const doc = await this.ToRead.findOne({ userId });
    return doc?.books ?? [];
  }
}

module.exports = { ToReadRepository };
