// controllers/bookController.js
const { searchVolumes, mapToToReadBook } = require('../services/googleBooks');

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

async function searchBooks(req, res) {
  try {
    const q = (req.query.q || '').trim();
    if (!q) {
      return res.status(400).json({ error: 'Missing q' });
    }

    const page = clamp(parseInt(req.query.page || '1', 10) || 1, 1, 1_000_000);
    const limit = clamp(parseInt(req.query.limit || '20', 10) || 20, 1, 40); // Google max 40
    const startIndex = (page - 1) * limit;

    const data = await searchVolumes(q, { startIndex, maxResults: limit });
    const items = (data.items || []).map(mapToToReadBook);

    const total = typeof data.totalItems === 'number' ? data.totalItems : items.length;
    const rawTotalPages = Math.max(Math.ceil(total / limit), 1);

    const MAX_PAGES = 50;
    const totalPages = Math.min(rawTotalPages, MAX_PAGES);

    const hasMore = page < rawTotalPages;

    const nextPage = hasMore ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    return res.json({
      q,
      page,
      limit,
      total,
      totalPages,
      hasMore,
      nextPage,
      prevPage,
      items
    });
  } catch (err) {
    console.error('Books search error:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'server error' });
  }
}

module.exports = { searchBooks };
