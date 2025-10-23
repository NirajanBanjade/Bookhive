// Extract comparable features (authors, categories, keywords) from a Google Books volumeInfo
class FeatureExtractor {
  constructor({ tokenizer, options = {} }) {
    this.tokenizer = tokenizer;
    this.maxKeywords = options.maxKeywords ?? 60;
  }

  /**
   * @param {object} volumeInfo - Google Books volumeInfo
   * @returns {{authors:Set<string>, categories:Set<string>, keywords:Set<string>, meta:{ratingsCount?:number, averageRating?:number, pageCount?:number}}}
   */
  extract(volumeInfo = {}) {
    const authors = new Set(
      (volumeInfo.authors || [])
        .map(a => a && String(a).trim().toLowerCase())
        .filter(Boolean)
    );

    const categories = new Set(
      (volumeInfo.categories || [])
        .flatMap(c => (c || "").split("/")) // Google often returns hierarchical categories like "Fiction / Mystery"
        .map(c => c && String(c).trim().toLowerCase())
        .filter(Boolean)
    );

    const descText = [volumeInfo.title, volumeInfo.subtitle, volumeInfo.description].filter(Boolean).join(" ");
    const kw = this.tokenizer.tokens(descText).slice(0, this.maxKeywords);
    const keywords = new Set(kw);

    const meta = {
      ratingsCount: volumeInfo.ratingsCount,
      averageRating: volumeInfo.averageRating,
      pageCount: volumeInfo.pageCount,
      publishedDate: volumeInfo.publishedDate
    };

    return { authors, categories, keywords, meta };
  }
}

module.exports = { FeatureExtractor };
