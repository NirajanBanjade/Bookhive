import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Optional: Add auth interceptor later (e.g., for JWT)
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export const getToReadBooks = async (userId) => {
  try {
    const response = await api.get(`/to-read/${userId}`);
    return response.data.books || [];
  } catch (error) {
    console.error('Fetch To-Read failed:', error);
    throw error;
  }
};

export const addDemoBookToRead = async (userId) => {
  try {
    const demoBook = {
      googleBookId: `demo-${Date.now()}`,
      title: `Test Book ${Date.now()}`,
      authors: ['Jane Doe'],
      thumbnail: 'https://example.com/image.jpg',
    };
    const response = await api.post(`/to-read/${userId}`, demoBook);
    return response.data.books || [];
  } catch (error) {
    console.error('Add demo book failed:', error);
    throw error.response?.data?.error || 'Failed to add demo book';
  }
};

export const removeBookFromToRead = async (userId, googleBookId) => {
  try {
    const response = await api.delete(`/to-read/${userId}/${googleBookId}`);
    return response.data.list?.books || [];
  } catch (error) {
    console.error('Remove book failed:', error);
    throw error.response?.data?.error || 'Failed to remove book';
  }
};