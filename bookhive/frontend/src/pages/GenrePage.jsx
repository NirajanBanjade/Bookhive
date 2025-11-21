import React from "react";
import { Link } from "react-router-dom";
import { GENRES } from "../constants/genre";

/**
 * GenrePage - Browse all book genres
 */
const GenrePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Page Header */}
        <div className="mb-16">
          <h1
            className="text-6xl font-bold text-white mb-4"
            style={{
              fontFamily: "'Playfair Display', 'Georgia', serif",
              letterSpacing: "-0.02em",
            }}
          >
            Explore by Genre
          </h1>
          <p
            className="text-xl text-gray-400"
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Discover your next favorite book by browsing our curated collection
          </p>
        </div>

        {/* Genre Grid */}
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
                  className="relative rounded-2xl p-8 border transition-all duration-300 transform hover:-translate-y-2 h-full overflow-hidden"
                  style={{
                    backgroundColor: genre.bgColor,
                    minHeight: "240px",
                    borderColor: "rgba(255,255,255,0.15)",
                    boxShadow:
                      "0 4px 6px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0, 0, 0, 0.4), 0 20px 40px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.15)";
                  }}
                >
                  {/* Subtle gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${genre.bgColor} 0%, rgba(255,255,255,0.2) 100%)`,
                    }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon - Animated on hover */}
                    <div className="mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <IconComponent
                        size={56}
                        strokeWidth={2}
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
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
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
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-20 text-center">
          <div
            className="inline-block px-8 py-4 rounded-xl border"
            style={{
              backgroundColor: "rgba(31, 41, 55, 0.6)",
              borderColor: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            }}
          >
            <p
              className="text-base text-gray-300"
              style={{
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Can't find what you're looking for? Try using the{" "}
              <Link
                to="/search"
                className="font-semibold transition-colors"
                style={{
                  color: "#fbbf24",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#f59e0b")}
                onMouseLeave={(e) => (e.target.style.color = "#fbbf24")}
              >
                search feature
              </Link>{" "}
              to find books by title or author.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenrePage;
