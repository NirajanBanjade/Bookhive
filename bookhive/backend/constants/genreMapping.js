const GENRE_MAPPING = {
  fiction: "subject:Fiction",
  fantasy: "subject:Fantasy",
  mystery: "subject:Mystery",
  romance: "subject:Romance",
  scifi: "subject:Science Fiction",
  horror: "subject:Horror",
  biography: "subject:Biography",
  history: "subject:History",
  selfhelp: "subject:Self-Help",
  business: "subject:Business",
  cooking: "subject:Cooking",
  poetry: "subject:Poetry",
};

/**
 * Genre aliases - handle common variations
 * Maps alternative names to the canonical genre ID
 */
const GENRE_ALIASES = {
  'sci-fi': 'scifi',
  'science-fiction': 'scifi',
  'sciencefiction': 'scifi',
  'self-help': 'selfhelp',
  'selfhelp': 'selfhelp',
  'bio': 'biography',
  'biographies': 'biography',
  'histories': 'history',
  'biz': 'business',
  'cook': 'cooking',
  'cookbooks': 'cooking',
  'poems': 'poetry',
};

function getGenreQuery(genreId) {
  return GENRE_MAPPING[genreId] || null;
}
  /**
   * Resolve genre ID from potential alias
   * @param {string} genreId - Genre ID or alias
   * @returns {string} - Canonical genre ID
   */
  function resolveGenreAlias(genreId) {
    const normalized = genreId.toLowerCase();
    return GENRE_ALIASES[normalized] || normalized;
  }
  
module.exports = { GENRE_MAPPING, getGenreQuery, resolveGenreAlias };
