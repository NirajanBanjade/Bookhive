import axios from "axios";

const API_BASE = "/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// Add token to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createReview = async (
  userId,
  googleBookId,
  rating,
  comment,
  authorName
) => {
  try {
    const response = await api.post(
      "/reviews",
      { userId, googleBookId, rating, comment, authorName },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Create review failed:", error);
    throw error.response?.data?.error || "Failed to create review";
  }
};

export const updateReview = async (reviewId, userId, rating, comment) => {
  try {
    const response = await api.put(
      `/reviews/${reviewId}`,
      { userId, rating, comment },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Update review failed:", error);
    throw error.response?.data?.error || "Failed to update review";
  }
};

export const deleteReview = async (reviewId, userId) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`, {
      data: { userId },
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error("Delete review failed:", error);
    throw error.response?.data?.error || "Failed to delete review";
  }
};

// FIXED: Corrected syntax error with backticks
export const getReviewsByBook = async (googleBookId) => {
  try {
    const response = await api.get(`/reviews/${googleBookId}`);
    return response.data.reviews || response.data || [];
  } catch (error) {
    console.error("Get reviews failed:", error);
    return []; // Return empty array instead of throwing
  }
};

// FIXED: Corrected syntax error with backticks
export const getReviewsByUser = async (userId) => {
  try {
    const response = await api.get(`/reviews`, {
      params: { userId },
      headers: getAuthHeaders(),
    });
    return response.data || [];
  } catch (error) {
    console.error("Get user reviews failed:", error);
    return []; // Return empty array instead of throwing
  }
};

// ADDED: Helper function for checking if user already reviewed a book
export const getReviewByUserAndBook = async (userId, googleBookId) => {
  try {
    const userReviews = await getReviewsByUser(userId);
    return (
      userReviews.find((review) => review.googleBookId === googleBookId) || null
    );
  } catch (error) {
    console.error("Error checking existing review:", error);
    return null;
  }
};

export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
};

// ADDED: Get book rating helper
export const getBookRating = async (googleBookId) => {
  try {
    const reviews = await getReviewsByBook(googleBookId);

    if (reviews.length === 0) {
      return { averageRating: 0, reviewCount: 0 };
    }

    const averageRating = calculateAverageRating(reviews);

    return {
      averageRating: parseFloat(averageRating),
      reviewCount: reviews.length,
    };
  } catch (error) {
    console.error("Error calculating book rating:", error);
    return { averageRating: 0, reviewCount: 0 };
  }
};
