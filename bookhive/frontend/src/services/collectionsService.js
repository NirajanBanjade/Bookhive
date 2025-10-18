import axios from 'axios';

// Use same base URL as toReadService
const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Optional: Add auth later (same as toReadService comment)
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export const getCollections = async (userId) => {
  try {
    const response = await api.get(`/collections/${userId}`);
    return response.data.books || [];
  } catch (error) {
    console.error('Fetch Collections failed:', error);
    throw error;
  }
};

export const updateBookStatus = async (userId, googleBookId, status) => {
  try {
    const response = await api.put(`/collections/${userId}/books/${googleBookId}/status`, { status });
    return response.data.books || [];
  } catch (error) {
    console.error('Update book status failed:', error);
    throw error;
  }
};