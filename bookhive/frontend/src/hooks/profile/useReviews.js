import { useState, useCallback } from "react";
import { createReview } from "../../services/reviewsService";

/**
 * Custom hook for managing book reviews
 * Handles review state and submission logic
 */
export const useReviews = (userId) => {
  // Review state for each book (keyed by googleBookId)
  const [reviewData, setReviewData] = useState({});

  // Update review data for a specific book
  const updateReviewData = useCallback((googleBookId, field, value) => {
    setReviewData((prev) => ({
      ...prev,
      [googleBookId]: {
        ...(prev[googleBookId] || { rating: 0, comment: "", submitted: false }),
        [field]: value,
      },
    }));
  }, []);

  // Submit a review for a book
  const handleSubmitReview = async (googleBookId) => {
    const review = reviewData[googleBookId];

    if (!review || !review.rating) {
      alert("Please select a rating");
      return;
    }

    if (!review.comment || !review.comment.trim()) {
      alert("Please write a review");
      return;
    }

    try {
      await createReview(userId, googleBookId, review.rating, review.comment.trim());

      setReviewData((prev) => ({
        ...prev,
        [googleBookId]: {
          rating: review.rating,
          comment: review.comment,
          submitted: true,
        },
      }));

      alert("Review submitted successfully!");
      window.dispatchEvent(new Event("notifications:refresh"));

      console.log("Review submitted for book:", googleBookId);
      console.log("Updated reviewData:", {
        [googleBookId]: {
          rating: review.rating,
          comment: review.comment,
          submitted: true,
        },
      });
    } catch (error) {
      console.error("Error submitting review:", error);

      if (error.includes && error.includes("already reviewed")) {
        setReviewData((prev) => ({
          ...prev,
          [googleBookId]: {
            rating: review.rating,
            comment: review.comment,
            submitted: true,
          },
        }));
        alert("You have already reviewed this book");
      } else {
        alert(error || "Failed to submit review");
      }
    }
  };

  return {
    reviewData,
    updateReviewData,
    handleSubmitReview,
  };
};