import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Add token to requests
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const createReview = async (userId, googleBookId, rating, comment) => {
  try {
    const response = await api.post(
      '/reviews', 
      { userId, googleBookId, rating, comment },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Create review failed:', error);
    throw error.response?.data?.error || 'Failed to create review';
  }
};

export const getReviewsByBook = async (googleBookId) => {
  try {
    const response = await api.get(`/reviews/${googleBookId}`);
    return response.data.reviews || response.data || [];
  } catch (error) {
    console.error('Get reviews failed:', error);
    throw error.response?.data?.error || 'Failed to fetch reviews';
  }
};

export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
};