const ToRead = require('../models/ToRead'); // make sure this is correct
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

exports.getToReadList = async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log('Searching for userId:', `"${userId}"`);

    const list = await ToRead.findOne({ userId });
    console.log('MongoDB returned:', list);

    res.status(200).json(list || { userId, books: [] });
  } catch (err) {
    console.error('Error fetching to-read list:', err);
    res.status(500).json({ error: err.message });
  }
};

