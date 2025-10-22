const ToRead = require("../models/ToRead");

class ExistingBooksRepository {
  constructor({ toReadModel = ToRead } = {}) {
    this.ToRead = toReadModel;
  }

  async getAllSavedGoogleIds(userId) {
    const ids = new Set();
    const toRead = await this.ToRead.findOne({ userId }, { books: 1, _id: 0 });
    for (const b of (toRead?.books ?? [])) {
      if (b.googleBookId) ids.add(b.googleBookId);
    }
    // TODO: add currentlyReading / finished models later
    return ids;
  }
}

module.exports = { ExistingBooksRepository };
