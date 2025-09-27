const router = require('express').Router();
const { searchVolumes, mapToToReadBook } = require('../services/googleBooks');

// GET /api/books/search?q=your+query
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.status(400).json({ error: 'Missing q' });

    const data = await searchVolumes(q, { maxResults: 20 });
    const items = (data.items || []).map(mapToToReadBook);

    res.json({ total: data.totalItems || items.length, items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
