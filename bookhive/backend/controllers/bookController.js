const axios = require('axios');

const GOOGLE_BOOKS_BASE = 'https://www.googleapis.com/books/v1/volumes';

// Helper function: normalize Google Books response
function mapVolumeItem(item) {
  const vi = item.volumeInfo || {};
  return {
    id: item.id,
    title: vi.title || 'No title',
    authors: vi.authors || [],
    publisher: vi.publisher || null,
    publishedDate: vi.publishedDate || null,
    description: vi.description || null,
    thumbnail: vi.imageLinks?.thumbnail || null,
    infoLink: vi.infoLink || null,
  };
}

// Controller function: GET /api/books?title=...
async function searchBooks(req, res) {
  const title = (req.query.title || req.query.q || '').trim();
  if (!title) {
    return res
      .status(400)
      .json({ error: 'Missing query parameter: title (example: /api/books?title=harry+potter)' });
  }

  try {
    const q = `intitle:${title}`;
    const params = {
      q,
      maxResults: 20,
      fields:
        'items(id,volumeInfo(title,authors,publisher,publishedDate,description,imageLinks/thumbnail,infoLink))',
    };

    if (process.env.GOOGLE_BOOKS_API_KEY) {
      params.key = process.env.GOOGLE_BOOKS_API_KEY;
    }

    const resp = await axios.get(GOOGLE_BOOKS_BASE, { params });
    const items = (resp.data.items || []).map(mapVolumeItem);

    res.json({ total: items.length, items });
  } catch (err) {
    console.error(
      'Google Books API error:',
      err.response?.status,
      err.response?.data || err.message
    );
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || 'Failed to fetch books';
    res.status(status).json({ error: message });
  }
}

module.exports = { searchBooks };
