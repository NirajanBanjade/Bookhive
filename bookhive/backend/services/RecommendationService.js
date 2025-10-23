class RecommendationService {
  /**
   * @param {Object} deps
   * @param {CandidateGenerator} deps.candidateGenerator
   * @param {UserInterestProfileRepository} deps.profileRepo
   * @param {FeatureExtractor} deps.featureExtractor
   * @param {ScoringStrategy} deps.scoring
   */
  constructor({ candidateGenerator, profileRepo, featureExtractor, scoring }) {
    this.candidateGenerator = candidateGenerator;
    this.profileRepo = profileRepo;
    this.featureExtractor = featureExtractor;
    this.scoring = scoring;
  }

  async recommend({ userId, limit = 20 }) {
    const profile = await this.profileRepo.getByUserId(userId);
    if (!profile) return { reason: "no_profile", items: [] };

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
