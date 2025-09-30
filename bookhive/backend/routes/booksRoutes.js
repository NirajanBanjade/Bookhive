const router = require('express').Router();
const { searchVolumes, mapToToReadBook } = require('../services/googleBooks');

// GET /api/books/search?q=your+query
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.status(400).json({ error: 'Missing q' });

    const page = Math.max(parseInt(req.query.page ?? '1', 10) || 1, 1);
    const rawLimit = Math.max(parseInt(req.query.limit ?? '12', 10) || 12, 1);
    const limit = Math.min(rawLimit, 40); // Google Books behaves well up to ~40
    const startIndex = (page - 1) * limit;

    const data = await searchVolumes(q, { startIndex, maxResults: limit });
    const items = (data.items || []).map(mapToToReadBook);

    const total =
      typeof data.totalItems === 'number' ? data.totalItems : items.length;
    const totalPages = Math.max(Math.ceil(total / limit), 1);

    res.json({ q, page, limit, total, totalPages, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
