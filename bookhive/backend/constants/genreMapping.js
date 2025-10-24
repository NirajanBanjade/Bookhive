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

function getGenreQuery(genreId) {
  return GENRE_MAPPING[genreId] || null;
}

module.exports = { GENRE_MAPPING, getGenreQuery };
