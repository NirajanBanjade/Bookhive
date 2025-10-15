const UserInterestProfile = require("../models/UserInterestProfile");

// SRP: Only reads/writes UserInterestProfile data for a user
class UserInterestProfileRepository {
  constructor({ Model = UserInterestProfile } = {}) {
    this.Model = Model;
  }

  async getByUserId(userId) {
    return this.Model.findOne({ userId });
  }

  async upsert(userId, profile) {
    return this.Model.findOneAndUpdate(
      { userId },
      { ...profile, lastBuiltAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }
}

module.exports = { UserInterestProfileRepository };
