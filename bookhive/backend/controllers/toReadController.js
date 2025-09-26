const ToRead = require('../models/ToRead'); // make sure this is correct
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

const clamp = (v, min, max, d) => {
  const n = Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : d;
};

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

 /* Keyword search inside the user's embedded books[] with pagination.
 */
exports.searchToReadBooks = async (req, res) => {
  const userId = req.params.userId;
  const q = (req.query.q || '').trim();
  const page = clamp(req.query.page, 1, 10000, 1);
  const limit = clamp(req.query.limit, 1, 50, 10);
  const skip = (page - 1) * limit;
exports.addBookToToRead = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { googleBookId, title, authors = [], thumbnail } = req.body;

  // If keyword exists, match title or any author (case-insensitive)
  const keywordMatch = q
    ? {
        $or: [
          { 'books.title':   { $regex: q, $options: 'i' } },
          { 'books.authors': { $elemMatch: { $regex: q, $options: 'i' } } }
        ]
      }
    : {};

  const pipeline = [
    { $match: { userId } },
    { $unwind: '$books' },
    ...(q ? [{ $match: keywordMatch }] : []),
    {
      $facet: {
        data: [
          { $sort: { 'books.title': 1, _id: 1 } }, // sort A→Z; adjust if needed
          { $skip: skip },
          { $limit: limit },
          {
            $project: {
              _id: 0,
              googleBookId: '$books.googleBookId',
              title: '$books.title',
              authors: '$books.authors',
              thumbnail: '$books.thumbnail'
            }
          }
        ],
        totalDocs: [{ $count: 'count' }]
      }
    }
  ];

  try {
    const result = await ToRead.aggregate(pipeline).exec();
    const data = result[0]?.data ?? [];
    const total = result[0]?.totalDocs?.[0]?.count ?? 0;

    return res.json({
      data,
      meta: {
        page,
        limit,
        returned: data.length,
        total,
        has_next: skip + data.length < total,
        has_prev: page > 1,
        next_page: skip + data.length < total ? page + 1 : null,
        prev_page: page > 1 ? page - 1 : null,
        q: q || undefined,
        userId
      }
    });
  } catch (err) {
    console.error('ToRead search error:', err);
    return res.status(500).json({ error: 'server error' });
  }
};

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