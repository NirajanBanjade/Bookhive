// SRP: orchestrates requests -> service calls
class RecommendationController {
  constructor({ builder, profileRepo }) {
    this.builder = builder;
    this.profileRepo = profileRepo;

    this.rebuildProfile = this.rebuildProfile.bind(this);
    this.getProfile = this.getProfile.bind(this);
  }

  async rebuildProfile(req, res, next) {
    try {
      const userId = req.user?.id || req.params.userId || req.query.userId;
      if (!userId) return res.status(400).json({ error: "userId required" });

      const profile = await this.builder.buildForUser(userId);
      res.json({ ok: true, profile });
    } catch (err) {
      next(err);
    }
  }

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
}

module.exports = { RecommendationController };
