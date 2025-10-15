const axios = require('axios');
const BASE = 'https://www.googleapis.com/books/v1/volumes';
// require('dotenv').config();

function withKey(params = {}, key = process.env.GOOGLE_BOOKS_API_KEY) {
  return key ? { ...params, key } : params;
}

// Search for books requested by user (query string)
async function searchVolumes(q, { startIndex = 0, maxResults = 20 } = {}) {
  console.log('API Key present:', !!process.env.GOOGLE_BOOKS_API_KEY);
  console.log('API Key (first 10 chars):', process.env.GOOGLE_BOOKS_API_KEY?.substring(0, 10));
  const { data } = await axios.get(BASE, {
    params: withKey({ q, startIndex, maxResults, printType: 'books' })
  });
  return data;
}

// Map Google API result to your ToRead schema
function mapToToReadBook(volume) {
  const info = volume?.volumeInfo || {};
   const thumb =
    info.imageLinks?.thumbnail ||
    info.imageLinks?.smallThumbnail ||
    '';
  const thumbnail = typeof thumb === 'string' ? thumb.replace(/^http:/, 'https:') : '';

  return {
    googleBookId: volume?.id || '',
    title: info.title || 'Untitled',
    authors: Array.isArray(info.authors) ? info.authors : [],
    thumbnail
  };
}

// Fetch detailed volume info by ID for profile building
async function getVolume(volumeId, { fields } = {}) {
  if (!volumeId) throw new Error('volumeId is required');

  const url = `${BASE}/${encodeURIComponent(volumeId)}`;
  const params = {key: process.env.GOOGLE_BOOKS_API_KEY};

  if (fields) params.fields = fields;

  const { data } = await axios.get(url, { params });

  return data;
}

module.exports = { searchVolumes, mapToToReadBook, getVolume };