// backend/controllers/toReadController.js
const ToReadService = require('../services/ToReadService');

// Utility to clamp a number within min/max or return default
const clamp = (v, min, max, d) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : d;
};

// Get full to-read list for a user
exports.getToReadList = async (req, res) => {
  try {
    const userId = req.params.userId;

    const list = await ToReadService.getToReadList(userId);

    res.status(200).json(list);
  } catch (err) {
    console.error('Error fetching to-read list:', err);
    res.status(500).json({ error: err.message });
  }
};

// Keyword search inside the user's books[] with pagination
exports.searchToReadBooks = async (req, res) => {
  try {
    const userId = req.params.userId;
    const q = (req.query.q || '').trim();
    const page = clamp(req.query.page, 1, 10000, 1);
    const limit = clamp(req.query.limit, 1, 50, 10);

    const result = await ToReadService.searchToReadBooks(userId, q, page, limit);

    res.status(200).json(result);
  } catch (err) {
    console.error('ToRead search error:', err);
    res.status(500).json({ error: 'server error' });
  }
};

// Add book to to-read list
exports.addBookToToRead = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookData = req.body;

    const result = await ToReadService.addBookToToRead(userId, bookData);

    // Clear status code logic based on explicit flag
    const statusCode = result.isNewAddition ? 201 : 200;
    res.status(statusCode).json(result.list);
  } catch (err) {
    console.error('addBookToToRead error:', err);
    
    if (err.message.includes('required') || 
        err.message.includes('already in your collection')) {
      return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ error: err.message });
  }
};

// Remove a book from the user's to-read list
exports.removeBookFromToRead = async (req, res) => {
  try {
    const { userId, googleBookId } = req.params;

    const list = await ToReadService.removeBookFromToRead(userId, googleBookId);

    res.status(200).json({ message: 'Book removed', list });
  } catch (err) {
    console.error('Error removing book from to-read:', err);
    
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    
    res.status(500).json({ error: err.message });
  }
};

// Move book from To-Read to Collections
exports.moveBookToCollections = async (req, res) => {
  try {
    const { userId, googleBookId } = req.params;
    const { status = 'currently-reading' } = req.body;

    const result = await ToReadService.moveBookToCollections(userId, googleBookId, status);

    res.status(200).json(result);
  } catch (err) {
    console.error('Error moving book to collections:', err);
    
    if (err.message.includes('Invalid status') || 
        err.message.includes('not found')) {
      return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ error: err.message });
  }
};