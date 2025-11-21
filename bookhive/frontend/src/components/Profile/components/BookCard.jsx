import React from "react";
import { Heart, Book } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ReviewSection from "./ReviewSection";
/**
 * BookCard Component
 * Displays a single book with its details, status controls, and review section
 */
const BookCard = React.memo(
  ({
    book,
    reviewData,
    favorites,
    onToggleFavorite,
    onStatusChange,
    onRemove,
    onCategoryJoin,
    onUpdateReview,
    onSubmitReview,
  }) => {
    const navigate = useNavigate();
    const isCompleted = book.status === "completed";
    // Navigate to book details page
    const handleTitleClick = () => {
      navigate(`/book/${book.googleBookId}`);
    };
    return (
      <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:shadow-2xl hover:border-amber-500/50 transition-all">
        <div className="aspect-[2/3] bg-gradient-to-br from-gray-700 to-gray-600 relative overflow-hidden flex items-center justify-center p-4">
          {book.thumbnail ? (
            <img
              src={book.thumbnail}
              alt={book.title}
              className="w-full h-full object-cover rounded-lg"
            />
          ) : (
            <span className="font-serif text-lg text-center text-white font-semibold leading-tight">
              {book.title}
            </span>
          )}
          <span
            className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium ${
              book.status === "completed"
                ? "bg-emerald-600 text-white"
                : book.status === "currently-reading"
                ? "bg-amber-600 text-white"
                : book.status === "re-reading"
                ? "bg-purple-600 text-white"
                : "bg-orange-600 text-white"
            }`}
          >
            {book.status === "want-to-read"
              ? "Want to Read"
              : book.status === "currently-reading"
              ? "Reading"
              : book.status === "re-reading"
              ? "Re-reading"
              : "Completed"}
          </span>
          <button
            onClick={(e) => onToggleFavorite(book.googleBookId, e)}
            className={`absolute top-2 right-2 p-2 rounded-full ${
              favorites.has(book.googleBookId)
                ? "bg-red-100 text-red-600"
                : "bg-gray-900/80 text-gray-400"
            } hover:scale-110 transition-all`}
            aria-label={
              favorites.has(book.googleBookId)
                ? "Remove from favorites"
                : "Add to favorites"
            }
          >
            <Heart
              className={`h-5 w-5 ${
                favorites.has(book.googleBookId) ? "fill-current" : ""
              }`}
            />
          </button>
        </div>
        <div className="p-4">
          {/* Clickable book title */}
          <h3
            onClick={handleTitleClick}
            className="font-serif font-semibold line-clamp-2 mb-1 text-white cursor-pointer hover:text-amber-400 transition-colors"
          >
            {book.title}
          </h3>
          <p className="text-sm text-gray-400 mb-3">
            {(book.authors || []).join(", ")}
          </p>
          <div className="flex gap-2 mb-3">
            {book.status === "want-to-read" && (
              <>
                <button
                  onClick={() =>
                    onStatusChange(
                      book.googleBookId,
                      "want-to-read",
                      "currently-reading"
                    )
                  }
                  className="flex-1 px-3 py-1.5 text-sm bg-gray-700 text-amber-400 border border-amber-500/50 rounded-lg hover:bg-gray-600 hover:border-amber-400 transition-colors font-medium"
                >
                  Start
                </button>
                <button
                  onClick={() =>
                    onStatusChange(
                      book.googleBookId,
                      "want-to-read",
                      "completed"
                    )
                  }
                  className="flex-1 px-3 py-1.5 text-sm bg-gray-700 text-orange-400 border border-orange-500/50 rounded-lg hover:bg-gray-600 hover:border-orange-400 transition-colors font-medium"
                >
                  Finish
                </button>
              </>
            )}
            {book.status === "currently-reading" && (
              <div className="flex gap-2 w-full">
                <select
                  value={book.status}
                  onChange={(e) =>
                    onStatusChange(
                      book.googleBookId,
                      book.status,
                      e.target.value
                    )
                  }
                  className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-700 text-gray-200"
                >
                  <option value="currently-reading">Currently Reading</option>
                  <option value="re-reading">Re-reading</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => onRemove(book.googleBookId, book.status)}
                  className="px-3 py-1.5 text-sm bg-gray-700 text-red-400 border border-red-500/50 rounded-lg hover:bg-gray-600 hover:border-red-400 transition-colors font-medium flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            )}
            {book.status === "re-reading" && (
              <div className="flex gap-2 w-full">
                <select
                  value={book.status}
                  onChange={(e) =>
                    onStatusChange(
                      book.googleBookId,
                      book.status,
                      e.target.value
                    )
                  }
                  className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-700 text-gray-200"
                >
                  <option value="re-reading">Re-reading</option>
                  <option value="currently-reading">Currently Reading</option>
                  <option value="completed">Completed</option>
                </select>
                <button
                  onClick={() => onRemove(book.googleBookId, book.status)}
                  className="px-3 py-1.5 text-sm bg-gray-700 text-red-400 border border-red-500/50 rounded-lg hover:bg-gray-600 hover:border-red-400 transition-colors font-medium flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            )}
            {book.status === "completed" && (
              <div className="flex gap-2 w-full">
                <select
                  value={book.status}
                  onChange={(e) =>
                    onStatusChange(
                      book.googleBookId,
                      book.status,
                      e.target.value
                    )
                  }
                  className="flex-1 min-w-0 px-3 py-1.5 text-sm border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-700 text-gray-200"
                >
                  <option value="completed">Completed</option>
                  <option value="re-reading">Re-reading</option>
                  <option value="currently-reading">Currently Reading</option>
                </select>
                <button
                  onClick={() => onRemove(book.googleBookId, book.status)}
                  className="px-3 py-1.5 text-sm bg-gray-700 text-red-400 border border-red-500/50 rounded-lg hover:bg-gray-600 hover:border-red-400 transition-colors font-medium flex-shrink-0"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
          {book.categories && book.categories.length > 0 && (
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Book className="h-3 w-3" />
                <span>Categories</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {book.categories.slice(0, 3).map((cat, idx) => (
                  <button
                    key={idx}
                    onClick={() => onCategoryJoin(cat)}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full hover:bg-amber-500/30 transition-colors border border-amber-500/30"
                  >
                    <Book className="h-3 w-3" />
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}
          {/* Review Section for Completed Books */}
          {isCompleted && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <ReviewSection
                book={book}
                reviewData={
                  reviewData || { rating: 0, comment: "", submitted: false }
                }
                onUpdateReview={onUpdateReview}
                onSubmitReview={onSubmitReview}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);
export default BookCard;
