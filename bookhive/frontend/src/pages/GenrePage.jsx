import React from "react";

/**
 * GenrePage - Browse all book genres
 *
 * This page displays all available genres as a grid of cards.
 * Users can click a genre to see filtered book results.
 *
 * TODO for team:
 * - Add genre cards in next commit
 * - Connect to Google Books API (Commit 6)
 * - Add skeleton loading state
 * - Consider adding genre search/filter
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

      {/* Genre Grid - Placeholder */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Genre Grid Coming Soon
          </h2>
          <p className="text-gray-600">
            We'll add genre cards in the next commit
          </p>
        </div>
      </div>
    </div>
  );
};

export default GenrePage;
