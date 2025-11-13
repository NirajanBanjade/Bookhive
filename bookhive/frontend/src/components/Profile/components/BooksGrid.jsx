import React from "react";

/**
 * BooksGrid Component
 * Displays books in a responsive grid with loading and empty states
 */
const BooksGrid = ({ books, loading, children }) => {
  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading books...</div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No books in this category yet
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {children}
    </div>
  );
};

export default BooksGrid;