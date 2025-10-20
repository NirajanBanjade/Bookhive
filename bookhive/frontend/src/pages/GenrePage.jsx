import React from "react";
import { Link } from "react-router-dom";
import { GENRES } from "../constants/genre";

/**
 * GenrePage - Browse all book genres
 *
 * Displays a grid of genre cards. Each card shows:
 * - Genre icon and name
 * - Brief description
 * - Visual styling (colors from constants)
 *
 * Clicking a card will navigate to filtered results (implemented in Commit 7)
 *
 * TODO for team:
 * - Add genre/:subject route and results page (next commits)
 * - Add loading skeleton if genres come from API later
 * - Consider adding genre popularity/book count
 * - Add search/filter for genres when list grows
 *
 * @component
 */
const GenrePage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafaf9" }}>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 font-serif">
            Explore by Genre
          </h1>
          <p className="text-lg text-gray-600">
            Discover your next favorite book by browsing our collection of
            genres
          </p>
        </div>
      </div>

      {/* Genre Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {GENRES.map((genre) => (
            <Link key={genre.id} to={`/genre/${genre.id}`} className="group">
              <div
                className={`bg-gradient-to-br ${genre.color} rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full`}
              >
                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">
                  {genre.icon}
                </div>

                {/* Genre Name */}
                <h3 className={`text-xl font-bold mb-2 ${genre.textColor}`}>
                  {genre.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed">
                  {genre.description}
                </p>

                {/* Arrow indicator */}
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Explore</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 text-sm">
            Can't find what you're looking for? Try using the{" "}
            <Link
              to="/search"
              className="text-primary hover:underline font-medium"
            >
              search feature
            </Link>{" "}
            to find books by title or author.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenrePage;
