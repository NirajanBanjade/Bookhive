import React from "react";
import { Star } from "lucide-react";

/**
 * ReviewSection Component
 * Handles review display and submission for completed books
 */
const ReviewSection = ({ book, reviewData, onUpdateReview, onSubmitReview }) => {
  const isSubmitted = reviewData && reviewData.submitted;

  if (isSubmitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-green-600 font-semibold">✓ Review Submitted</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700">Rating:</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= (reviewData.rating || 0)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            ({reviewData.rating || 0}/5)
          </span>
        </div>
        {reviewData.comment && (
          <div className="text-sm text-gray-700">
            <span className="font-medium">Review:</span>
            <p className="mt-1 italic">"{reviewData.comment}"</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Rating:
        </label>
        <select
          value={reviewData?.rating || 0}
          onChange={(e) =>
            onUpdateReview(book.googleBookId, "rating", parseInt(e.target.value))
          }
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value={0}>Select</option>
          <option value={1}>1 star</option>
          <option value={2}>2 stars</option>
          <option value={3}>3 stars</option>
          <option value={4}>4 stars</option>
          <option value={5}>5 stars</option>
        </select>
      </div>

      <div className="mb-3">
        <textarea
          value={reviewData?.comment || ""}
          onChange={(e) =>
            onUpdateReview(book.googleBookId, "comment", e.target.value)
          }
          placeholder="Write your review..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          rows={3}
        />
      </div>

      <button
        onClick={() => onSubmitReview(book.googleBookId)}
        className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
      >
        Submit Review
      </button>
    </>
  );
};

export default ReviewSection;