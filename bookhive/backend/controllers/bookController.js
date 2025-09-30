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
    const limit = clamp(parseInt(req.query.limit || '20', 10) || 20, 1, 40); 
    const startIndex = (page - 1) * limit;

    const data = await searchVolumes(q, { startIndex, maxResults: limit });
    const items = (data.items || []).map(mapToToReadBook);

    return res.json({
      total: data.totalItems || 0,
      items
    });
  } catch (err) {
    console.error('Books search error:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'server error' });
  }
}

module.exports = { searchBooks };
