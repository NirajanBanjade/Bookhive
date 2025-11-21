import { useState, useCallback, useEffect } from "react";
import { createReview, getReviewsByUser } from "../../services/reviewsService";

/**
 * Custom hook for managing book reviews
 * Handles review state and submission logic
 * Fetches existing reviews on mount to prevent duplicates
 */
export const useReviews = (userId, authorName) => {
  // Review state for each book (keyed by googleBookId)
  const [reviewData, setReviewData] = useState({});
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Fetch user's existing reviews on mount
  useEffect(() => {
    const fetchExistingReviews = async () => {
      if (!userId) {
        setLoadingReviews(false);
        return;
      }

      try {
        const existingReviews = await getReviewsByUser(userId);

        // Build reviewData object from existing reviews
        const existingReviewData = {};
        existingReviews.forEach((review) => {
          existingReviewData[review.googleBookId] = {
            rating: review.rating,
            comment: review.comment,
            submitted: true,
          };
        });

        setReviewData(existingReviewData);
      } catch (error) {
        console.error("Error fetching existing reviews:", error);
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchExistingReviews();
  }, [userId]);

  // FIXED: Update review data - now accepts object { rating, comment }
  // to match new ReviewSection component API
  const updateReviewData = useCallback((googleBookId, updates) => {
    setReviewData((prev) => ({
      ...prev,
      [googleBookId]: {
        ...(prev[googleBookId] || { rating: 0, comment: "", submitted: false }),
        ...updates,
      },
    }));
  }, []);

  // FIXED: Submit review - now accepts reviewDetails parameter from ReviewSection
  const handleSubmitReview = async (googleBookId, reviewDetails) => {
    // Get review from parameter or fallback to state
    const review = reviewDetails || reviewData[googleBookId];

    if (!review || !review.rating) {
      alert("Please select a rating");
      return;
    }

    if (!review.comment || !review.comment.trim()) {
      alert("Please write a review");
      return;
    }

    if (!authorName) {
      alert("Author name is required");
      return;
    }

    try {
      await createReview(
        userId,
        googleBookId,
        review.rating,
        review.comment.trim(),
        authorName
      );

      // Mark as submitted in local state
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
    } catch (error) {
      console.error("Error submitting review:", error);

      // Check if already reviewed
      if (
        error &&
        typeof error === "string" &&
        error.includes("already reviewed")
      ) {
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
    loadingReviews,
  };
};
