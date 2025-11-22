/**
 * Genre/Subject Mappings for BookHive
 *
 * NOTE: Google Books API uses "subject" parameter, not "genre"
 * This file maps user-friendly genre names to Google Books subjects
 *
 * @module constants/genres
 */
import {
  BookOpen,
  Sparkles,
  Search,
  Heart,
  Rocket,
  Ghost,
  User,
  Scroll,
  Zap,
  Briefcase,
  ChefHat,
  Feather,
} from "lucide-react";

export const GENRES = [
  {
    id: "fiction",
    name: "Fiction",
    subject: "Fiction",
    description: "Novels and literary fiction",
    icon: BookOpen,
    bgColor: "#dbeafe",
    titleColor: "#1e40af",
    descColor: "#475569",
  },
  {
    id: "fantasy",
    name: "Fantasy",
    subject: "Fantasy",
    description: "Magic, mythical creatures, and epic adventures",
    icon: Sparkles,
    bgColor: "#e9d5ff",
    titleColor: "#7c3aed",
    descColor: "#475569",
  },
  {
    id: "mystery",
    name: "Mystery",
    subject: "Mystery",
    description: "Whodunits, thrillers, and detective stories",
    icon: Search,
    bgColor: "#e5e7eb",
    titleColor: "#374151",
    descColor: "#6b7280",
  },
  {
    id: "romance",
    name: "Romance",
    subject: "Romance",
    description: "Love stories and romantic fiction",
    icon: Heart,
    bgColor: "#fce7f3",
    titleColor: "#db2777",
    descColor: "#475569",
  },
  {
    id: "scifi",
    name: "Science Fiction",
    subject: "Science Fiction",
    description: "Future tech, space, and scientific speculation",
    icon: Rocket,
    bgColor: "#ccfbf1",
    titleColor: "#0d9488",
    descColor: "#475569",
  },
  {
    id: "horror",
    name: "Horror",
    subject: "Horror",
    description: "Scary stories and supernatural tales",
    icon: Ghost,
    bgColor: "#fecaca",
    titleColor: "#dc2626",
    descColor: "#475569",
  },
  {
    id: "biography",
    name: "Biography",
    subject: "Biography",
    description: "Life stories and memoirs",
    icon: User,
    bgColor: "#fef3c7",
    titleColor: "#d97706",
    descColor: "#78716c",
  },
  {
    id: "history",
    name: "History",
    subject: "History",
    description: "Historical events and non-fiction",
    icon: Scroll,
    bgColor: "#fef08a",
    titleColor: "#ca8a04",
    descColor: "#78716c",
  },
  {
    id: "selfhelp",
    name: "Self-Help",
    subject: "Self-Help",
    description: "Personal development and improvement",
    icon: Zap,
    bgColor: "#d1fae5",
    titleColor: "#059669",
    descColor: "#475569",
  },
  {
    id: "business",
    name: "Business",
    subject: "Business",
    description: "Entrepreneurship and business strategies",
    icon: Briefcase,
    bgColor: "#ddd6fe",
    titleColor: "#6366f1",
    descColor: "#475569",
  },
  {
    id: "cooking",
    name: "Cooking",
    subject: "Cooking",
    description: "Recipes and culinary arts",
    icon: ChefHat,
    bgColor: "#fed7aa",
    titleColor: "#ea580c",
    descColor: "#78716c",
  },
  {
    id: "poetry",
    name: "Poetry",
    subject: "Poetry",
    description: "Poems and verse",
    icon: Feather,
    bgColor: "#fbcfe8",
    titleColor: "#ec4899",
    descColor: "#475569",
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
