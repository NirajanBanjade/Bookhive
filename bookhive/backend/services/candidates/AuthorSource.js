class AuthorSource {
  constructor({ booksService, perAuthor = 5, topAuthors = 5 }) {
    this.booksService = booksService;
    this.perAuthor = perAuthor;
    this.topAuthors = topAuthors;
  }

  async fetch({ profile, limit = 20 }) {
    if (!profile?.authors?.length) return [];
    const authors = profile.authors.slice(0, this.topAuthors);
    const out = [];
    for (const a of authors) {
      const q = `inauthor:"${a.name}"`;
      const data = await this.booksService.searchVolumes({ q, maxResults: Math.min(this.perAuthor, limit) });
      for (const item of (data.items ?? [])) {
        out.push({
          id: item.id,
          volumeInfo: item.volumeInfo,
          source: `author:${a.name}`,
          scoreHint: a.weight, // can be used later by ranker
        });
      }
    }
    return out;
  }
}

module.exports = { AuthorSource };
