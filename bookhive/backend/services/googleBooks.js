const axios = require('axios');
const BASE = 'https://www.googleapis.com/books/v1/volumes';

function withKey(params = {}, key = process.env.GOOGLE_BOOKS_API_KEY) {
  return key ? { ...params, key } : params;
}

// Search for books
async function searchVolumes(q, { startIndex = 0, maxResults = 20 } = {}) {
  const { data } = await axios.get(BASE, {
    params: withKey({ q, startIndex, maxResults, printType: 'books' })
  });
  return data;
}

// Map Google API result to your ToRead schema
function mapToToReadBook(volume) {
  const info = volume?.volumeInfo || {};
  return {
    googleBookId: volume?.id || '',
    title: info.title || 'Untitled',
    authors: info.authors || [],
    thumbnail:
      info.imageLinks?.thumbnail ||
      info.imageLinks?.smallThumbnail ||
      ''
  };
}

module.exports = { searchVolumes, mapToToReadBook };
