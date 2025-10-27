const Review = require('../models/Review');
const Collection = require('../models/Collection');
const Notification = require('../models/Notification');

// Create a review (only for books in Collection)
exports.createReview = async (req, res) => {
  try {
    const { userId, googleBookId, rating, comment } = req.body;

    if (!userId || !googleBookId || !rating) {
      return res.status(400).json({ error: 'userId, googleBookId, and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    // Check if book is in user's Collection
    const collection = await Collection.findOne({ userId, 'books.googleBookId': googleBookId });
    if (!collection) {
      return res.status(400).json({ error: 'Book must be in your collection to review' });
    }

    // Get the book details from the collection
    const book = collection.books.find(b => b.googleBookId === googleBookId);
    const bookTitle = book?.title || 'this book';

    // Check for existing review
    const existingReview = await Review.findOne({ userId, googleBookId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this book' });
    }

    const review = new Review({ userId, googleBookId, rating, comment });
    await review.save();

    // Updated notification with book title instead of ID
    await Notification.create({
      userId,
      message: `You added a ${rating}-star review for "${bookTitle}".`,
      type: 'success',
    });

    res.status(201).json(review);
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// List reviews (by user or book)
exports.listReviews = async (req, res) => {
  try {
    const { userId, googleBookId } = req.query;
    const query = {};
    if (userId) query.userId = userId;
    if (googleBookId) query.googleBookId = googleBookId;

    if (!userId && !googleBookId) {
      return res.status(400).json({ error: 'userId or googleBookId is required' });
    }

    const reviews = await Review.find(query).sort({ reviewedAt: -1 }).limit(50);
    res.status(200).json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Try to get book title from collection
    const collection = await Collection.findOne({ 
      userId: review.userId, 
      'books.googleBookId': review.googleBookId 
    });
    const book = collection?.books.find(b => b.googleBookId === review.googleBookId);
    const bookTitle = book?.title || 'a book';

    await Notification.create({
      userId: review.userId,
      message: `Your review for "${bookTitle}" was deleted.`,
      type: 'info',
    });

    res.status(200).json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getReviewsByBook = async (req, res) => {
  try {
    const { googleBookId } = req.params;

    if (!googleBookId) {
      return res.status(400).json({ error: 'googleBookId is required' });
    }

    const reviews = await Review.find({ googleBookId })
      .sort({ reviewedAt: -1 })
      .limit(100);

    res.status(200).json({ reviews, count: reviews.length });
  } catch (err) {
    console.error('Error fetching reviews by book:', err);
    res.status(500).json({ error: 'Server error' });
  }
};