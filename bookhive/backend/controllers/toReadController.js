const ToRead = require('../models/ToRead');

exports.getToReadList = async (req, res) => {
  try {
    const userId = req.params.userId;
    const list = await ToRead.findOne({ userId });
    res.json(list || { userId, books: [] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addBookToToRead = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { googleBookId, title, authors = [], thumbnail } = req.body;

    if (!googleBookId || !title) {
      return res.status(400).json({ error: 'googleBookId and title are required' });
    }

    const book = { googleBookId, title, authors, thumbnail };

    // Find or create list; prevent duplicates
    let list = await ToRead.findOne({ userId });
    if (!list) {
      list = new ToRead({ userId, books: [book] });
      await list.save();
      return res.status(201).json(list);
    }

    const exists = list.books.some(b => b.googleBookId === googleBookId);
    if (exists) {
      return res.status(200).json({ message: 'Book already in to-read list', list });
    }

    list.books.push(book);
    await list.save();
    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeBookFromToRead = async (req, res) => {
  try {
    const { userId, googleBookId } = req.params;
    const updated = await ToRead.findOneAndUpdate(
      { userId },
      { $pull: { books: { googleBookId } } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'To-read list not found for user' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
