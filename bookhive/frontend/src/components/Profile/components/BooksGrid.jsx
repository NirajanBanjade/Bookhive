import React from "react";
/**
 * BooksGrid Component
 * Displays books in a responsive grid with loading and empty states
 */
const BooksGrid = ({ books, loading, children }) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-400">Loading books...</p>
        </div>
      </div>
    );
  }
  if (books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex flex-col items-center gap-4 text-gray-400">
          <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center border border-gray-700">
            <span className="text-2xl">📚</span>
          </div>
          <p>No books in this category yet</p>
          <p className="text-sm text-gray-500">Start building your library!</p>
        </div>
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
