// OCP via pluggable sources/weighting; DIP via constructor injection
//const { getVolume } = require("./googleBooks");

class InterestProfileBuilder {
  /**
   * @param {Object} deps
   * @param {ToReadRepository} deps.toReadRepo
   * @param {UserInterestProfileRepository} deps.profileRepo
   * @param {googleBooks.getVolume} booksService
   * @param {Tokenizer} deps.tokenizer
   * @param {Object} [deps.options]
   * @param {number} [deps.options.maxKeywords] - cap keyword features
   */
  constructor({ toReadRepo, profileRepo, booksService, tokenizer, options = {} }) {
    this.toReadRepo = toReadRepo;
    this.profileRepo = profileRepo;
    this.booksService = booksService;
    this.tokenizer = tokenizer;
    this.maxKeywords = options.maxKeywords ?? 200;
  }

  async buildForUser(userId) {
    // 1) Gather local saved books
    const toRead = await this.toReadRepo.getBooksForUser(userId);

    // TODO: integrate other sources similarly (currentlyReadingRepo, finishedRepo, etc.)
    const books = toRead; // merge later if you add more lists

    // 2) Build term maps
    const authorCounts = {};
    const categoryCounts = {};
    const keywordTF = {};

    for (const b of books) {
      const vol = await this._ensureVolume(b);
      const info = vol?.volumeInfo ?? {};

      // Authors
      for (const a of (info.authors ?? [])) {
        const key = a.trim().toLowerCase();
        authorCounts[key] = (authorCounts[key] || 0) + 1;
      }

      // Categories (genres)
      for (const c of (info.categories ?? [])) {
        const key = c.trim().toLowerCase();
        categoryCounts[key] = (categoryCounts[key] || 0) + 1;
      }

      // Keywords from description
      const tokens = this.tokenizer.tokens(info.description || "");
      for (const t of tokens) {
        keywordTF[t] = (keywordTF[t] || 0) + 1;
      }
    }

    // 3) Normalize each channel to 0..1
    const authors = this._normalize(authorCounts);
    const categories = this._normalize(categoryCounts);
    const keywords = this._normalize(keywordTF).slice(0, this.maxKeywords);

    // 4) Persist
    const profileDoc = await this.profileRepo.upsert(userId, {
      userId,
      authors,
      categories,
      keywords,
      sourceCounts: {
        toRead: toRead.length,
        // fill in others when added
      }
    });

    return profileDoc;
  }

  async _ensureVolume(book) {
    // If the ToRead doc already has enough info, you could skip.
    // For now, always fetch to avoid stale data; add caching later.
    if (!book?.googleBookId) return null;
    return /*getVolume(book.googleBookId);*/this.booksService(book.googleBookId);
  }

  _normalize(counts) {
    const entries = Object.entries(counts);
    if (entries.length === 0) return [];
    const max = Math.max(...entries.map(([, c]) => c));
    return entries
      .map(([name, cnt]) => ({ name, weight: cnt / max }))
      .sort((a, b) => b.weight - a.weight);
  }
}

module.exports = { InterestProfileBuilder };
