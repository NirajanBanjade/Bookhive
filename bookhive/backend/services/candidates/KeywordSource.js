class KeywordSource {
  constructor({ booksService, perKeyword = 3, topKeywords = 15 }) {
    this.booksService = booksService;
    this.perKeyword = perKeyword;
    this.topKeywords = topKeywords;
  }

  async fetch({ profile, limit = 30 }) {
    if (!profile?.keywords?.length) return [];
    const kws = profile.keywords.slice(0, this.topKeywords);
    const out = [];
    for (const k of kws) {
      const q = `${k.name}`; // broad text query; could also use intitle: or inpublisher:
      const data = await this.booksService.searchVolumes({ q, maxResults: Math.min(this.perKeyword, limit) });
      for (const item of (data.items ?? [])) {
        out.push({
          id: item.id,
          volumeInfo: item.volumeInfo,
          source: `keyword:${k.name}`,
          scoreHint: k.weight,
        });
      }
    }
    return out;
  }
}

module.exports = { KeywordSource };
