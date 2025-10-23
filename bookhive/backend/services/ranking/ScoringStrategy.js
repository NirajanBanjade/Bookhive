// Default scoring: mix of profile similarity + popularity/quality signals
class ScoringStrategy {
  constructor({
    weights = {
      authors: 0.50,
      categories: 0.30,
      keywords: 0.20,
      popularity: 0.10,     // ratingsCount / quality boost
      ratingQuality: 0.08,  // averageRating boost
      recency: 0.04         // mild boost to newer books if date is parseable
    },
    keywordCap = 200
  } = {}) {
    this.w = weights;
    this.keywordCap = keywordCap;
  }

  /**
   * @param {object} profile - { authors:[{name,weight}], categories:[{name,weight}], keywords:[{name,weight}] }
   * @param {object} features - { authors:Set, categories:Set, keywords:Set, meta:{} }
   * @returns {number} score
   */
  score(profile, features) {
    const { authors, categories, keywords, meta } = features;

    // Map profile arrays -> quick lookup maps
    const authMap = mapify(profile?.authors || []);
    const catMap  = mapify(profile?.categories || []);
    const kwMap   = mapify((profile?.keywords || []).slice(0, this.keywordCap));

    const sAuthors = overlapWeighted(authors, authMap);
    const sCats    = overlapWeighted(categories, catMap);
    const sKw      = overlapWeighted(keywords, kwMap);

    // Normalize each channel to 0..1 already by construction (profile weights in 0..1).
    // Popularity & quality signals
    const pop = normalizePopularity(meta?.ratingsCount);
    const quality = normalizeAverageRating(meta?.averageRating);
    const recency = normalizeRecency(meta?.publishedDate);

    // Weighted sum
    const similarity =
        this.w.authors   * sAuthors +
        this.w.categories* sCats +
        this.w.keywords  * sKw;

    const extras =
        this.w.popularity    * pop +
        this.w.ratingQuality * quality +
        this.w.recency       * recency;

    // Clamp for safety
    return Math.max(0, similarity + extras);
  }
}

// ===== helpers =====
function mapify(arr) {
  const m = Object.create(null);
  for (const { name, weight } of arr) {
    if (!name) continue;
    const key = String(name).toLowerCase();
    const w = typeof weight === "number" ? weight : 1;
    m[key] = Math.max(m[key] || 0, w);
  }
  return m;
}

// Sum of profile weights for any tokens that appear in the candidate set.
// More matching tokens → higher score; heavier tokens (according to the profile) contribute more.
function overlapWeighted(tokenSet, profileMap) {
  if (!tokenSet || !profileMap) return 0;
  let sum = 0;
  for (const t of tokenSet) {
    const w = profileMap[t];
    if (w) sum += w;
  }
  // Normalize by possible maximum (sum of all profile weights) for stability
  const max = Object.values(profileMap).reduce((a, b) => a + b, 0) || 1;
  return Math.min(1, sum / max);
}

function normalizePopularity(ratingsCount) {
  if (!ratingsCount || ratingsCount <= 0) return 0;
  // simple log scale (cap ~ thousands)
  const v = Math.log10(1 + ratingsCount) / 4; // 0..~1 for counts up to ~10^4
  return clamp01(v);
}

function normalizeAverageRating(avg) {
  if (typeof avg !== "number") return 0;
  // Google averages are 0..5; map 3.0→~0.2, 4.0→~0.4, 4.5→~0.6, 5.0→1
  return clamp01((avg - 2.5) / 2.5);
}

function normalizeRecency(dateStr) {
  if (!dateStr) return 0;
  // very rough: newer than ~5 years → positive
  const y = parseInt(String(dateStr).slice(0, 4), 10);
  if (!Number.isFinite(y)) return 0;
  const now = new Date().getFullYear();
  const age = Math.max(0, now - y);
  // 0 yrs -> 1.0, 5 yrs -> ~0.3, 10 yrs -> 0
  const v = Math.max(0, 1 - (age / 10));
  return clamp01(v);
}

function clamp01(x) { return Math.max(0, Math.min(1, x)); }

module.exports = { ScoringStrategy };
