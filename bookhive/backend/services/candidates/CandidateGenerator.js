let pLimit = require("p-limit");
pLimit = pLimit.default || pLimit;

class CandidateGenerator {
  /**
   * @param {Object} deps
   * @param {UserInterestProfileRepository} deps.profileRepo
   * @param {ExistingBooksRepository} deps.existingRepo
   * @param {Array} deps.sources  // instances of AuthorSource/CategorySource/KeywordSource
   * @param {Object} [deps.options]
   * @param {number} [deps.options.concurrency]
   */
  constructor({ profileRepo, existingRepo, sources, options = {} }) {
    this.profileRepo = profileRepo;
    this.existingRepo = existingRepo;
    this.sources = sources;
    this.concurrency = options.concurrency ?? 3;
  }

  async generate({ userId, limit = 50 }) {
    const profile = await this.profileRepo.getByUserId(userId);
    if (!profile) return { candidates: [], reason: "no_profile" };

    const existing = await this.existingRepo.getAllSavedGoogleIds(userId);

    const limitRun = pLimit(this.concurrency);
    const results = await Promise.allSettled(
      this.sources.map(src => limitRun(() => src.fetch({ profile, limit })))
    );

    // Merge + de-duplicate by Google volume id
    const seen = new Set(existing);
    const merged = [];
    for (const r of results) {
      if (r.status !== "fulfilled") continue;
      for (const item of r.value) {
        if (!item?.id) continue;
        if (seen.has(item.id)) continue; // filter out saved & dupes
        seen.add(item.id);
        merged.push(item);
        if (merged.length >= limit) break;
      }
      if (merged.length >= limit) break;
    }

    return { candidates: merged };
  }
}

module.exports = { CandidateGenerator };
