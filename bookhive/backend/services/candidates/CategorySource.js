class CategorySource {
  constructor({ booksService, perCategory = 5, topCategories = 5 }) {
    this.booksService = booksService;
    this.perCategory = perCategory;
    this.topCategories = topCategories;
  }

  async fetch({ profile, limit = 20 }) {
    if (!profile?.categories?.length) return [];
    const cats = profile.categories.slice(0, this.topCategories);
    const out = [];
    for (const c of cats) {
      // Google Books categories are not strictly standardized; use intitle+subject heuristics
      const q = `subject:"${c.name}"`;
      const data = await this.booksService.searchVolumes({ q, maxResults: Math.min(this.perCategory, limit) });
      for (const item of (data.items ?? [])) {
        out.push({
          id: item.id,
          volumeInfo: item.volumeInfo,
          source: `category:${c.name}`,
          scoreHint: c.weight,
        });
      }
    }
    return out;
  }
}

module.exports = { CategorySource };
