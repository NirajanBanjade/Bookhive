/**
 * Genre/Subject Mappings for BookHive
 *
 * NOTE: Google Books API uses "subject" parameter, not "genre"
 * This file maps user-friendly genre names to Google Books subjects
 *
 * @module constants/genres
 *
 * TODO for team:
 * - Add more genres as needed
 * - Update icons/colors when design system is ready
 * - Backend team: Use these same values for consistency
 */

export const GENRES = [
  {
    id: "fiction",
    name: "Fiction",
    subject: "Fiction", // Google Books subject parameter
    description: "Novels and literary fiction",
    icon: "📚",
    color: "from-blue-100 to-blue-200",
    textColor: "text-blue-700",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    subject: "Fantasy",
    description: "Magic, mythical creatures, and epic adventures",
    icon: "🐉",
    color: "from-purple-100 to-purple-200",
    textColor: "text-purple-700",
  },
  {
    id: "mystery",
    name: "Mystery",
    subject: "Mystery",
    description: "Whodunits, thrillers, and detective stories",
    icon: "🔍",
    color: "from-gray-100 to-gray-200",
    textColor: "text-gray-700",
  },
  {
    id: "romance",
    name: "Romance",
    subject: "Romance",
    description: "Love stories and romantic fiction",
    icon: "💕",
    color: "from-pink-100 to-pink-200",
    textColor: "text-pink-700",
  },
  {
    id: "scifi",
    name: "Science Fiction",
    subject: "Science Fiction",
    description: "Future tech, space, and scientific speculation",
    icon: "🚀",
    color: "from-cyan-100 to-cyan-200",
    textColor: "text-cyan-700",
  },
  {
    id: "horror",
    name: "Horror",
    subject: "Horror",
    description: "Scary stories and supernatural tales",
    icon: "👻",
    color: "from-red-100 to-red-200",
    textColor: "text-red-700",
  },
  {
    id: "biography",
    name: "Biography",
    subject: "Biography",
    description: "Life stories and memoirs",
    icon: "👤",
    color: "from-amber-100 to-amber-200",
    textColor: "text-amber-700",
  },
  {
    id: "history",
    name: "History",
    subject: "History",
    description: "Historical events and non-fiction",
    icon: "📜",
    color: "from-yellow-100 to-yellow-200",
    textColor: "text-yellow-700",
  },
  {
    id: "selfhelp",
    name: "Self-Help",
    subject: "Self-Help",
    description: "Personal development and improvement",
    icon: "💪",
    color: "from-green-100 to-green-200",
    textColor: "text-green-700",
  },
  {
    id: "business",
    name: "Business",
    subject: "Business",
    description: "Entrepreneurship and business strategies",
    icon: "💼",
    color: "from-indigo-100 to-indigo-200",
    textColor: "text-indigo-700",
  },
  {
    id: "cooking",
    name: "Cooking",
    subject: "Cooking",
    description: "Recipes and culinary arts",
    icon: "🍳",
    color: "from-orange-100 to-orange-200",
    textColor: "text-orange-700",
  },
  {
    id: "poetry",
    name: "Poetry",
    subject: "Poetry",
    description: "Poems and verse",
    icon: "✍️",
    color: "from-rose-100 to-rose-200",
    textColor: "text-rose-700",
  },
];

/**
 * Get genre by ID
 * @param {string} id - Genre ID
 * @returns {Object|undefined} Genre object
 */
export const getGenreById = (id) => {
  return GENRES.find((g) => g.id === id);
};

/**
 * Get genre by subject (for API responses)
 * @param {string} subject - Google Books subject
 * @returns {Object|undefined} Genre object
 */
export const getGenreBySubject = (subject) => {
  return GENRES.find((g) => g.subject.toLowerCase() === subject.toLowerCase());
};