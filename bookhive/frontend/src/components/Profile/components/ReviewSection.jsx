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

  // Force collapse form if review becomes submitted
  useEffect(() => {
    if (isSubmitted) {
      setIsExpanded(false);
    }
  }, [isSubmitted]);

  // If review already submitted, show badge (no button, no form)
  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <span className="text-green-600 font-semibold text-sm">✓ Reviewed</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${
                  star <= (reviewData.rating || 0)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">
            ({reviewData.rating}/5)
          </span>
        </div>
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
    <div className="border border-orange-200 rounded-lg p-4 bg-orange-50">
      {/* Collapse button */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Write Your Review</span>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronUp className="h-5 w-5" />
        </button>
      </div>

      {/* Rating dropdown */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating:
        </label>
        <select
          value={reviewData?.rating || 0}
          onChange={(e) =>
            onUpdateReview(book.googleBookId, "rating", parseInt(e.target.value))
          }
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
        >
          <option value={0}>Select</option>
          <option value={1}>1 star</option>
          <option value={2}>2 stars</option>
          <option value={3}>3 stars</option>
          <option value={4}>4 stars</option>
          <option value={5}>5 stars</option>
        </select>
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

      {/* Submit button */}
      <button
        onClick={() => {
          onSubmitReview(book.googleBookId);
          setIsExpanded(false); // Close form after submit attempt
        }}
        className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewSection;