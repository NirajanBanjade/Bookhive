import React, { useState, useEffect } from "react";
import { X, Book as BookIcon, Star, Loader2 } from "lucide-react";
import { getBookById } from "../../api/books";
import { getReviewsByBook } from "../../services/reviewsService";
import "./BookModal.css";

const BookModal = ({ googleBookId, onClose, currentUserId }) => {
  const [bookInfo, setBookInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch book info and reviews in parallel
        const [bookData, reviewsData] = await Promise.all([
          getBookById(googleBookId),
          getReviewsByBook(googleBookId),
        ]);

        setBookInfo(bookData);
        setReviews(reviewsData || []);
      } catch (err) {
        console.error("Error fetching book data:", err);
        setError(err.message || "Failed to load book details");
      } finally {
        setLoading(false);
      }
    };

    if (googleBookId) {
      fetchBookData();
    }
  }, [googleBookId]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!googleBookId) return null;

  const { volumeInfo, book } = bookInfo || {};
  const thumbnail =
    volumeInfo?.imageLinks?.thumbnail ||
    volumeInfo?.imageLinks?.smallThumbnail ||
    book?.thumbnail;
  const title = volumeInfo?.title || book?.title || "Unknown Title";
  const authors = volumeInfo?.authors || book?.authors || ["Unknown Author"];
  const description = volumeInfo?.description;
  const publishedDate = volumeInfo?.publishedDate;
  const pageCount = volumeInfo?.pageCount;

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="book-modal-overlay" onClick={onClose}>
      <div className="book-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} className="book-modal-close">
          <X className="h-6 w-6" />
        </button>

        {loading ? (
          <div className="book-modal-loading">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
            <p className="mt-4 text-gray-600">Loading book details...</p>
          </div>
        ) : error ? (
          <div className="book-modal-error">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <div className="book-modal-body">
            {/* Book Cover & Info */}
            <div className="book-modal-header">
              <div className="book-modal-cover">
                {thumbnail ? (
                  <img src={thumbnail.replace("http:", "https:")} alt={title} />
                ) : (
                  <div className="book-modal-cover-placeholder">
                    <BookIcon className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="book-modal-info">
                <h2 className="book-modal-title">{title}</h2>
                <p className="book-modal-author">
                  by {Array.isArray(authors) ? authors.join(", ") : authors}
                </p>

                {/* Average Rating */}
                {averageRating && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-lg text-gray-900">
                        {averageRating}
                      </span>
                      <span className="text-sm text-gray-600">/ 5</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      ({reviews.length}{" "}
                      {reviews.length === 1 ? "review" : "reviews"})
                    </span>
                  </div>
                )}

                {/* Meta Info */}
                <div className="book-modal-meta">
                  {publishedDate && (
                    <span className="book-modal-meta-item">
                      📅 Published {publishedDate}
                    </span>
                  )}
                  {pageCount && (
                    <span className="book-modal-meta-item">
                      📖 {pageCount} pages
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {description && (
              <div className="book-modal-description">
                <h3 className="book-modal-description-title">Description</h3>
                <p className="book-modal-description-text">
                  {description.replace(/<[^>]*>/g, "")}
                </p>
              </div>
            )}

            {/* Reader Reviews Section */}
            {reviews.length > 0 && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Reader Reviews
                </h3>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id || review._id}
                      className={`p-4 rounded-lg border ${
                        review.userId === currentUserId
                          ? "bg-amber-50 border-amber-200"
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {review.authorName?.charAt(0) || "U"}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">
                              {review.authorName || "Anonymous"}
                              {review.userId === currentUserId && (
                                <span className="ml-2 text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-gray-500">
                              {review.createdAt &&
                                new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Rating Stars */}
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      {review.comment && (
                        <p className="text-gray-700 text-sm leading-relaxed mt-2">
                          {review.comment}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookModal;
