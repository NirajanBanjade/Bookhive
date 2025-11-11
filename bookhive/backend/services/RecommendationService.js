class RecommendationService {
  /**
   * @param {Object} deps
   * @param {CandidateGenerator} deps.candidateGenerator
   * @param {UserInterestProfileRepository} deps.profileRepo
   * @param {FeatureExtractor} deps.featureExtractor
   * @param {ScoringStrategy} deps.scoring
   * @param {InterestProfileBuilder} [deps.builder] - optional, for time-based rebuilds
   */
  constructor({ candidateGenerator, profileRepo, featureExtractor, scoring, builder }) {
    this.candidateGenerator = candidateGenerator;
    this.profileRepo = profileRepo;
    this.featureExtractor = featureExtractor;
    this.scoring = scoring;
    
    // for time-based rebuild
    this.builder = builder || null;
    this.lastRebuildAt = new Map(); // userId -> timestamp (ms)
    this.maxProfileAgeMs = 60 * 60 * 1000; // e.g. 1 hour
  }

    async _getFreshProfile(userId) {
    // If we don't have a builder, just return whatever exists
    if (!this.builder) {
      return await this.profileRepo.getByUserId(userId);
    }

    const now = Date.now();
    const last = this.lastRebuildAt.get(userId) || 0;
    const isTooOld = now - last > this.maxProfileAgeMs;

    let profile = await this.profileRepo.getByUserId(userId);

    // If no profile at all OR profile considered stale, rebuild it
    if (!profile || isTooOld) {
      try {
        const result = await this.builder.buildForUser(userId);
        profile = result?.profile || (await this.profileRepo.getByUserId(userId));
        if (profile) {
          this.lastRebuildAt.set(userId, now);
        }
      } catch (err) {
        console.error("Failed to rebuild interest profile for user", userId, err);
        // fall through and use existing profile if any
      }
    }

    return profile;
  }


  async recommend({ userId, limit = 20 }) {
    // 0) Ensure we have a reasonably fresh profile
    const profile = await this._getFreshProfile(userId);
    if (!profile) {
      return { reason: "no_profile", items: [] };
    }

    // 1) generate candidates (already filtered against saved books)
    const { candidates } = await this.candidateGenerator.generate({ userId, limit: limit * 3 }); // over-generate a bit

    // 2) score each candidate
    const scored = [];
    for (const c of candidates) {
      const vi = c?.volumeInfo || {};
      const feats = this.featureExtractor.extract(vi);
      const score = this.scoring.score(profile, feats);
      // carry some meta through
      scored.push({
        id: c.id,
        source: c.source,
        scoreHint: c.scoreHint,
        score,
        volumeInfo: vi,
      });
    }

    // 3) sort & trim
    scored.sort((a, b) => b.score - a.score || (b.scoreHint || 0) - (a.scoreHint || 0));
    return { reason: "ok", items: scored.slice(0, limit) };
  }
}

module.exports = { RecommendationService };
