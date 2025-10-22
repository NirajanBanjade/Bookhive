import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const createReview = async (userId, googleBookId, rating, comment) => {
  try {
    const response = await api.post('/reviews', { userId, googleBookId, rating, comment });
    return response.data;
  } catch (error) {
    console.error('Create review failed:', error);
    throw error.response?.data?.error || 'Failed to create review';
  }
};