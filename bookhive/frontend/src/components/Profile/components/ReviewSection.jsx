import React, { useState, useEffect } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

/**
 * ReviewSection Component
 * Handles review display and submission for completed books
 * Collapsed by default, expands on button click
 */
const ReviewSection = ({
  book,
  reviewData,
  onUpdateReview,
  onSubmitReview,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState(reviewData?.rating || 0);
  const [comment, setComment] = useState(reviewData?.comment || "");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSubmitted = reviewData && reviewData.submitted;

  // Sync local state with reviewData when it changes
  useEffect(() => {
    if (reviewData?.rating) {
      setRating(reviewData.rating);
    }
    if (reviewData?.comment) {
      setComment(reviewData.comment);
    }
  }, [reviewData?.rating, reviewData?.comment]);

  // Force collapse form if review becomes submitted
  useEffect(() => {
    if (isSubmitted) {
      setIsExpanded(false);
    }
  }, [isSubmitted]);

  const handleRatingClick = (starRating) => {
    setRating(starRating);
    if (onUpdateReview) {
      onUpdateReview(book.googleBookId, { rating: starRating, comment });
    }
  };

  const handleCommentChange = (e) => {
    const newComment = e.target.value;
    setComment(newComment);
    if (onUpdateReview) {
      onUpdateReview(book.googleBookId, { rating, comment: newComment });
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating before submitting your review.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (onSubmitReview) {
        await onSubmitReview(book.googleBookId, { rating, comment });
      }
      setIsExpanded(false); // Close form after successful submit
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If review already submitted, show read-only view
  if (isSubmitted) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 border border-amber-500/30 shadow-lg">
        <h4 className="text-amber-400 font-semibold mb-3 text-sm flex items-center gap-2">
          <span className="text-lg">✓</span> Your Review
        </h4>

        {/* Display submitted rating */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-gray-300 text-sm">Rating:</span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= reviewData.rating
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-600"
                }`}
              />
            ))}
          </div>
          <span className="text-amber-400 text-sm font-medium">
            {reviewData.rating}/5
          </span>
        </div>

        {/* Display submitted comment */}
        {reviewData.comment && (
          <div>
            <span className="text-gray-300 text-sm">Review:</span>
            <p className="text-gray-200 text-sm mt-1 leading-relaxed">
              {reviewData.comment}
            </p>
          </div>
        )}
      </div>
    );
  }

  // If not reviewed yet, show "Write Review" button
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="w-full px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-400 hover:to-amber-500 hover:shadow-xl hover:scale-105 transition-all duration-200 text-sm font-semibold flex items-center justify-center gap-2 shadow-lg"
      >
        Write Review
        <ChevronDown className="h-4 w-4" />
      </button>
    );
  }

  // Calculate character count
  const characterCount = comment.length;
  const maxCharacters = 500;

  // If expanded, show the review form
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-600 shadow-xl">
      {/* Collapse button */}
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-amber-400 font-semibold text-sm">Rate & Review</h4>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-400 hover:text-amber-400 transition-colors"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      </div>

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm mb-2">Rating:</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="focus:outline-none hover:scale-110 transition-transform"
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "fill-amber-400 text-amber-400 hover:fill-amber-300 hover:text-amber-300"
                    : "text-gray-600 hover:text-gray-500"
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-2 text-amber-400 text-sm font-medium">
              {rating}/5 stars
            </span>
          )}
        </div>
      </div>

      {/* Review Comment */}
      <div className="mb-4">
        <label className="block text-gray-300 text-sm mb-2">
          Write your review (optional):
        </label>
        <textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Share your thoughts about this book..."
          rows="3"
          maxLength={maxCharacters}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none text-sm hover:border-gray-500 transition-colors"
        />
        <div className="flex justify-end mt-1">
          <span
            className={`text-xs ${
              characterCount > maxCharacters * 0.9
                ? "text-amber-400 font-medium"
                : "text-gray-500"
            }`}
          >
            {characterCount}/{maxCharacters} characters
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || rating === 0}
        className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
          rating === 0
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : isSubmitting
            ? "bg-gradient-to-r from-amber-400 to-amber-500 text-white cursor-wait shadow-lg"
            : "bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-400 hover:to-amber-500 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-gray-700 shadow-lg"
        }`}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            Submitting...
          </div>
        ) : (
          "Submit Review"
        )}
      </button>
    </div>
  );
};

export default ReviewSection;
