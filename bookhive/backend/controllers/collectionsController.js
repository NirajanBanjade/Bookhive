// backend/controllers/collectionsController.js
const CollectionService = require('../services/CollectionService');

// Get full collections list for a user
exports.getCollectionsList = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const list = await CollectionService.getCollectionsList(userId);
    
    res.status(200).json(list);
  } catch (err) {
    console.error('Error fetching collections:', err);
    res.status(500).json({ error: err.message });
  }
};

// Add a book directly to collections
exports.addBookToCollections = async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookData = req.body;

    const list = await CollectionService.addBookToCollections(userId, bookData);
    
    res.status(201).json(list);
  } catch (err) {
    console.error('Error adding book to collections:', err);
    
    if (err.message.includes('required')) {
      return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ error: err.message });
  }
};

// Update book status (currently-reading <-> completed)
exports.updateBookStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const googleBookId = req.params.googleBookId;
    const { status } = req.body;

    const collection = await CollectionService.updateBookStatus(userId, googleBookId, status);

    res.status(200).json({
      message: 'Status updated',
      books: collection.books,
    });
  } catch (err) {
    console.error('Error updating status:', err);
    
    if (err.message.includes('Invalid status') || 
        err.message.includes('not found')) {
      return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ error: err.message });
  }
};

// Remove book from collections
exports.removeBookFromCollections = async (req, res) => {
  try {
    const { userId, googleBookId } = req.params;

    const collection = await CollectionService.removeBookFromCollections(userId, googleBookId);

    res.status(200).json({
      message: 'Book removed from collection',
      books: collection.books,
    });
  } catch (err) {
    console.error('Error removing book from collection:', err);
    
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    
    res.status(500).json({ error: err.message });
  }
};