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

module.exports = { GENRE_MAPPING, getGenreQuery };
