import React from "react";
import { Link } from "react-router-dom";
import { GENRES } from "../constants/genre";

/**
 * GenrePage - Browse all book genres
 */
const GenrePage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafaf9" }}>
      {/* Page Header - No white background */}
      <div
        className="border-b border-gray-200"
        style={{ backgroundColor: "#fafaf9" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1
            className="text-5xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: "'Playfair Display', 'Georgia', serif" }}
          >
            Explore by Genre
          </h1>
          <p
            className="text-xl text-gray-600"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Discover your next favorite book by browsing our collection of
            genres
          </p>
        </div>
      </div>

      {/* Genre Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {GENRES.map((genre) => {
            const IconComponent = genre.icon;

            return (
              <Link
                key={genre.id}
                to={`/genre/${genre.id}`}
                className="group block"
              >
                <div
                  className="relative rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full"
                  style={{
                    backgroundColor: genre.bgColor,
                    minHeight: "240px",
                  }}
                >
                  {/* Icon - Animated on hover */}
                  <div className="mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <IconComponent
                      size={56}
                      strokeWidth={1.5}
                      color={genre.titleColor}
                    />
                  </div>

                  {/* Genre Name */}
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{
                      color: genre.titleColor,
                      fontFamily: "'Poppins', 'Arial', sans-serif",
                    }}
                  >
                    {genre.name}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm leading-relaxed"
                    style={{
                      color: genre.descColor,
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    {genre.description}
                  </p>

                  {/* Hover arrow indicator */}
                  <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: genre.titleColor }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <p
            className="text-gray-600 text-base"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Can't find what you're looking for? Try using the{" "}
            <Link
              to="/search"
              className="text-orange-500 hover:text-orange-600 font-semibold hover:underline transition-colors"
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
