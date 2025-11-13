import React from "react";
import { Heart, Book } from "lucide-react";
import ReviewSection from "./ReviewSection";

/**
 * BookCard Component
 * Displays a single book with its details, status controls, and review section
 */
const BookCard = React.memo(({
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
  const isCompleted = book.status === "completed";

  console.log(`BookCard for ${book.title}:`, {
    googleBookId: book.googleBookId,
    reviewData,
    submitted: reviewData?.submitted,
  });

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
      <div className="aspect-[2/3] bg-gradient-to-br from-amber-50 to-orange-100 relative overflow-hidden flex items-center justify-center p-4">
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-serif text-lg text-center text-gray-800 font-semibold leading-tight">
            {book.title}
          </span>
        )}
        <span
          className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium ${
            book.status === "completed"
              ? "bg-teal-600 text-white"
              : book.status === "currently-reading"
              ? "bg-blue-600 text-white"
              : "bg-teal-600 text-white"
          }`}
        >
          {book.status === "want-to-read"
            ? "Want to Read"
            : book.status === "currently-reading"
            ? "Reading"
            : "Completed"}
        </span>

        <button
          onClick={(e) => onToggleFavorite(book.googleBookId, e)}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            favorites.has(book.googleBookId)
              ? "bg-red-100 text-red-600"
              : "bg-white/80 text-gray-400"
          } hover:scale-110 transition-all`}
        >
          <Heart
            className={`h-5 w-5 ${
              favorites.has(book.googleBookId) ? "fill-current" : ""
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-serif font-semibold line-clamp-2 mb-1 text-gray-900">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
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
                className="flex-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Start
              </button>
              <button
                onClick={() =>
                  onStatusChange(book.googleBookId, "want-to-read", "completed")
                }
                className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Finish
              </button>
            </>
          )}

          {book.status === "currently-reading" && (
            <select
              value={book.status}
              onChange={(e) =>
                onStatusChange(book.googleBookId, book.status, e.target.value)
              }
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="currently-reading">Currently Reading</option>
              <option value="completed">Completed</option>
            </select>
          )}

          {book.status === "completed" && (
            <select
              value={book.status}
              onChange={(e) =>
                onStatusChange(book.googleBookId, book.status, e.target.value)
              }
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="completed">Completed</option>
              <option value="currently-reading">Currently Reading</option>
            </select>
          )}

          <button
            onClick={() => onRemove(book.googleBookId, book.status)}
            className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Remove
          </button>
        </div>

        {book.categories && book.categories.length > 0 && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Book className="h-3 w-3" />
              <span>Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {book.categories.slice(0, 3).map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => onCategoryJoin(cat)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full hover:bg-yellow-200 transition-colors"
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
          <div className="mt-4 pt-4 border-t border-gray-200">
            <ReviewSection
              book={book}
              reviewData={reviewData || { rating: 0, comment: "", submitted: false }}
              onUpdateReview={onUpdateReview}
              onSubmitReview={onSubmitReview}
            />
          </div>
        )}
      </div>
    </div>
  );
});

export default BookCard;