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

