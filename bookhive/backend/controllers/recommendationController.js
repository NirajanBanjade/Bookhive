// SRP: orchestrates requests -> service calls
class RecommendationController {
  constructor({ builder, profileRepo, candidateGenerator }) {
    this.builder = builder;
    this.profileRepo = profileRepo;
    this.candidateGenerator = candidateGenerator;

    this.rebuildProfile = this.rebuildProfile.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getCandidates = this.getCandidates.bind(this);
  }

  // POST /api/recommendations/profile/rebuild
  // Rebuilds the interest profile for the specified user
  // If userId is not provided, uses the authenticated user's ID
  // Used by recommendationController component when user requests rebuild
  async rebuildProfile(req, res, next) {
    try {
      const userId = req.user?.id || req.params.userId || req.query.userId || req.body?.userId;
      if (!userId) return res.status(400).json({ error: "userId required" });

      const { profile, warnings } = await this.builder.buildForUser(userId);
      res.json({ ok: true, profile, warnings: warnings ?? [] });
    } catch (err) {
        if ([502,503,504].includes(err.status)) {
            return res.status(503).json({ error: "Google Books temporarily unavailable. Try again later." });
        }
      next(err);
    }
  }

  // GET /api/recommendations/profile
  // Fetches the interest profile for the specified user
  async getProfile(req, res, next) {
    try {
      const userId = req.user?.id || req.params.userId || req.query.userId;
      if (!userId) return res.status(400).json({ error: "userId required" });

      const profile = await this.profileRepo.getByUserId(userId);
      if (!profile) return res.status(404).json({ error: "Profile not found" });
      res.json({ ok: true, profile });
    } catch (err) {
      next(err);
    }
  }

  async getCandidates(req, res, next) {
    try {
      const userId = req.user?.id || req.params.userId || req.query.userId;
      const limit = Number(req.query.limit || 30);
      if (!userId) return res.status(400).json({ error: "userId required" });

      const { candidates, reason } = await this.candidateGenerator.generate({ userId, limit });
      res.json({ ok: true, reason, count: candidates.length, candidates });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = { RecommendationController };
