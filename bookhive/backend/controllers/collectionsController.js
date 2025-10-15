const Collection = require('../models/Collection');

// Get full collections list for a user
exports.getCollectionsList = async (req, res) => {
  try {
    const userId = req.params.userId;
    const list = await Collection.findOne({ userId });
    res.status(200).json(list || { userId, books: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a book directly to collections (optional for later)
exports.addBookToCollections = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { googleBookId, title, authors = [], thumbnail } = req.body;

    if (!googleBookId || !title) {
      return res.status(400).json({ error: 'googleBookId and title are required' });
    }

    let list = await Collection.findOne({ userId });
    if (!list) {
      list = new Collection({ userId, books: [{ googleBookId, title, authors, thumbnail }] });
    } else {
      const exists = list.books.some(b => b.googleBookId === googleBookId);
      if (!exists) list.books.push({ googleBookId, title, authors, thumbnail });
    }

    await list.save();
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update book status (in-progress <-> finished)
exports.updateBookStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const googleBookId = req.params.googleBookId;
    const { status } = req.body;

    const validStatuses = ['currently-reading', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status: must be currently-reading or completed' });
    }

    const list = await Collection.findOneAndUpdate(
      { userId, 'books.googleBookId': googleBookId },
      { $set: { 'books.$.status': status } },
      { new: true }
    );

    if (!list) {
      return res.status(404).json({ error: 'Book not found in collection' });
    }

    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};