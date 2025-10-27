const Collection = require('../models/Collection');
const Notification = require('../models/Notification');

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

// Add a book directly to collections
exports.addBookToCollections = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { googleBookId, title, authors = [], thumbnail, categories = [] } = req.body;

    if (!googleBookId || !title) {
      return res.status(400).json({ error: 'googleBookId and title are required' });
    }

    let list = await Collection.findOne({ userId });
    if (!list) {
      list = new Collection({ userId, books: [{ googleBookId, title, authors, thumbnail, categories }] });
    } else {
      const exists = list.books.some(b => b.googleBookId === googleBookId);
      if (!exists) list.books.push({ googleBookId, title, authors, thumbnail, categories });
    }

    await list.save();
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update book status (currently-reading <-> completed)
exports.updateBookStatus = async (req, res) => {
  try {
    const userId = req.params.userId;
    const googleBookId = req.params.googleBookId;
    const { status } = req.body;

    const validStatuses = ['currently-reading', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const collection = await Collection.findOne({ userId });
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const book = collection.books.find(b => b.googleBookId === googleBookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found in collection' });
    }

    // Update status
    book.status = status;
    await collection.save();

    // Create notification
    await Notification.create({
      userId,
      message: `Book "${book.title}" marked as ${status === 'currently-reading' ? 'Currently Reading' : 'Completed'}.`,
      type: 'success',
    });

    res.status(200).json({
      message: 'Status updated',
      books: collection.books,
    });
  } catch (err) {
    console.error('Error updating status:', err);
    res.status(500).json({ error: err.message });
  }
};

// Remove book from collections
exports.removeBookFromCollections = async (req, res) => {
  try {
    const { userId, googleBookId } = req.params;

    const collection = await Collection.findOne({ userId });
    if (!collection) {
      return res.status(404).json({ error: 'User collection not found' });
    }

    const bookToRemove = collection.books.find(b => b.googleBookId === googleBookId);
    if (!bookToRemove) {
      return res.status(404).json({ error: 'Book not found in collection' });
    }

    collection.books = collection.books.filter(b => b.googleBookId !== googleBookId);
    await collection.save();

    await Notification.create({
      userId,
      message: `Book "${bookToRemove.title}" was removed from your collection.`,
      type: 'info',
    });

    res.status(200).json({
      message: 'Book removed from collection',
      books: collection.books,
    });
  } catch (err) {
    console.error('Error removing book from collection:', err);
    res.status(500).json({ error: err.message });
  }
};