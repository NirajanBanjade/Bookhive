const ToRead = require("../models/ToRead");
const Collection = require("../models/Collection");

class ExistingBooksRepository {
  constructor({ 
    toReadModel = ToRead,
    collectionModel = Collection
  } = {}) {
    this.ToRead = toReadModel;
    this.Collection = collectionModel;
  }

  async getAllSavedGoogleIds(userId) {
    const ids = new Set();
    const toRead = await this.ToRead.findOne({ userId }, { books: 1, _id: 0 });
    for (const b of (toRead?.books ?? [])) {
      if (b.googleBookId) ids.add(b.googleBookId);
    }
    // TODO: add currentlyReading / finished models later
    const col = await this.Collection.findOne({ userId }, { books: 1, _id: 0 });
    for (const b of (col?.books ?? [])) {
      if (b.googleBookId && b.status === "currently-reading"){ 
        ids.add(b.googleBookId);
      }
    }
    
    return ids;
  }
}

module.exports = { ExistingBooksRepository };
