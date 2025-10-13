// src/services/toReadService.js
import axios from 'axios';

const API_BASE = 'http://localhost:5050/api'; // Match your backend port

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Optional: Add auth if you have JWT
// api.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

export const getToReadBooks = async (userId) => {
  const response = await api.get(`/to-read/${userId}`);
  return response.data.books || [];
};

export const addDemoBookToRead = async (userId) => {
  const demoBook = {
    googleBookId: `demo-${Date.now()}`,
    title: 'Demo Book',
    authors: ['Jane Doe'],
    thumbnail: 'https://example.com/image.jpg',
  };
  const response = await api.post(`/to-read/${userId}`, demoBook);
  return response.data.books || [];
};

export const removeBookFromToRead = async (userId, googleBookId) => {
  const response = await api.delete(`/to-read/${userId}/${googleBookId}`);
  return response.data.list.books || [];
};

// Add move if ready (from controller)
// export const moveBookToCollections = async (userId, googleBookId) => {
//   const response = await api.put(`/to-read/${userId}/${googleBookId}/move`);
//   return response.data;
// };