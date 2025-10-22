// Adapts team's googleBooks.js to a service-like object.
const { searchVolumes, getVolume } = require("../services/googleBooks");

class GoogleBooksAdapter {
  async searchVolumes({ q, maxResults = 10, startIndex = 0, orderBy = "relevance" }) {
    // searchVolumes signature is (q, { startIndex, maxResults }) from ../services/googleBooks
    const data = await searchVolumes(q, { startIndex, maxResults });
    return data; // { items, totalItems, ... }
  }

  async getVolume(volumeId, opts = {}) {
    return getVolume(volumeId, opts);
  }
}

module.exports = { GoogleBooksAdapter };
