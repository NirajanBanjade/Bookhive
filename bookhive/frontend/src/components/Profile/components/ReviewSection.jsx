import React, { useState, useEffect } from "react";
import { Star, ChevronDown, ChevronUp } from "lucide-react";

/**
 * ReviewSection Component
 * Handles review display and submission for completed books
 * Collapsed by default, expands on button click
 */
const ReviewSection = ({ book, reviewData, onUpdateReview, onSubmitReview }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isSubmitted = reviewData && reviewData.submitted;
const ReviewSection = ({
  book,
  reviewData,
  onUpdateReview,
  onSubmitReview,
}) => {
  const [rating, setRating] = useState(reviewData?.rating || 0);
  const [comment, setComment] = useState(reviewData?.comment || "");
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Force collapse form if review becomes submitted
  useEffect(() => {
    if (isSubmitted) {
      setIsExpanded(false);
    }
  }, [isSubmitted]);

  // If review already submitted, show badge (no button, no form)
  if (isSubmitted) {
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
    } catch (error) {
      console.error("Error submitting review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If review is already submitted, show read-only view
  if (reviewData?.submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <span className="text-green-600 font-semibold text-sm">✓ Reviewed</span>
          <div className="flex gap-0.5">
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
        className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium flex items-center justify-center gap-2"
      >
        Write Review
        <ChevronDown className="h-4 w-4" />
      </button>
    );
  }

  // Calculate character count
  const characterCount = (reviewData?.comment || "").length;
  const maxCharacters = 500;

  // If expanded, show the review form
  return (
    <div className="bg-gray-700 rounded-lg p-4 border border-gray-600">
      <h4 className="text-amber-400 font-semibold mb-3 text-sm">
        Rate & Review
      </h4>

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

      {/* Comment textarea */}
      <div className="mb-3">
        <textarea
          value={reviewData?.comment || ""}
          onChange={(e) =>
            onUpdateReview(book.googleBookId, "comment", e.target.value)
          }
          placeholder="Write your review..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none bg-white"
          rows={3}
          maxLength={maxCharacters}
        />
        <div className="flex justify-end mt-1">
          <span className={`text-xs ${
            characterCount > maxCharacters * 0.9 
              ? 'text-orange-600 font-medium' 
              : 'text-gray-500'
          }`}>
            {characterCount}/{maxCharacters} characters
          </span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || rating === 0}
        className={`w-full py-2 px-4 rounded-lg font-medium text-sm transition-colors ${
          rating === 0
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : isSubmitting
            ? "bg-amber-300 text-white cursor-wait"
            : "bg-amber-700 text-white hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
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
