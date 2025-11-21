import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Book as BookIcon, Star, User, Edit2, Trash2, X, Check } from 'lucide-react';
import { getBookById } from '../api/books';
import { getReviewsByBook, calculateAverageRating, updateReview, deleteReview } from '../services/reviewsService';

const BookDetails = () => {
  const { googleBookId } = useParams();
  const [bookInfo, setBookInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Edit mode state
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');

  // Get current user ID from localStorage
  const currentUserId = localStorage.getItem('userId');

  // Fetch book details from YOUR backend
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchBookInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBookById(googleBookId, { signal: controller.signal });
        setBookInfo(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching book info:', err);
          setError(err.message || 'Failed to load book details');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookInfo();
    
    return () => controller.abort();
  }, [googleBookId]);

  // Fetch reviews from YOUR backend
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        const data = await getReviewsByBook(googleBookId);
        // Sort by most recent first
        const sorted = (data || []).sort((a, b) => 
          new Date(b.reviewedAt) - new Date(a.reviewedAt)
        );
        setReviews(sorted);
      } catch (error) {
        console.error('Error getting reviews:', error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchReviews();
  }, [googleBookId]);

  // Calculate average rating
  const averageRating = calculateAverageRating(reviews);

  // Start editing a review
  const handleStartEdit = (review) => {
    setEditingReviewId(review._id);
    setEditRating(review.rating);
    setEditComment(review.comment);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingReviewId(null);
    setEditRating(0);
    setEditComment('');
  };

  // Save edited review
  const handleSaveEdit = async (reviewId) => {
    if (!editRating || editRating < 1 || editRating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }

    if (!editComment.trim()) {
      alert('Please write a review comment');
      return;
    }

    try {
      const updatedReview = await updateReview(reviewId, currentUserId, editRating, editComment.trim());
      
      // Update local state
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review._id === reviewId ? { ...review, rating: editRating, comment: editComment.trim() } : review
        )
      );

      // Exit edit mode
      handleCancelEdit();
      
      alert('Review updated successfully!');
    } catch (error) {
      console.error('Error updating review:', error);
      alert(error || 'Failed to update review');
    }
  };

  // Delete a review
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      await deleteReview(reviewId, currentUserId);
      
      // Remove from local state
      setReviews(prevReviews => prevReviews.filter(review => review._id !== reviewId));
      
      alert('Review deleted successfully!');
      
      // Trigger notification refresh
      window.dispatchEvent(new Event('notifications:refresh'));
    } catch (error) {
      console.error('Error deleting review:', error);
      alert(error || 'Failed to delete review');
    }
  };

  // Star Rating Component (for display)
  const StarRating = ({ rating, size = 'default' }) => {
    const sizeClasses = {
      small: 'h-3 w-3',
      default: 'h-4 w-4',
      large: 'h-6 w-6'
    };
    
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  // Interactive Star Rating Component (for editing)
  const InteractiveStarRating = ({ rating, onRatingChange }) => {
    const [hoverRating, setHoverRating] = useState(0);
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= (hoverRating || rating)
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-gray-300 hover:text-amber-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  // Format date to relative time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!bookInfo) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">Book not found</p>
        </div>
      </div>
    );
  }

  const { volumeInfo, book } = bookInfo;
  const thumbnail = volumeInfo?.imageLinks?.thumbnail || volumeInfo?.imageLinks?.smallThumbnail || book?.thumbnail;
  const title = volumeInfo?.title || book?.title || 'Unknown Title';
  const authors = volumeInfo?.authors || book?.authors || ['Unknown Author'];
  const description = volumeInfo?.description;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Book Header */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <div className="w-48 h-72 bg-gradient-to-br from-amber-50 to-orange-100 rounded-lg shadow-lg overflow-hidden">
                {thumbnail ? (
                  <img 
                    src={thumbnail.replace('http:', 'https:')}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full p-6">
                    <BookIcon className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>

            {/* Book Info */}
            <div className="flex-1">
              <h1 className="font-serif text-4xl font-bold mb-2 text-gray-900">
                {title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                by {Array.isArray(authors) ? authors.join(', ') : authors}
              </p>

              {/* Rating Summary */}
              {reviews.length > 0 && (
                <div className="bg-white rounded-lg p-4 inline-block shadow-sm border border-gray-200 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-gray-900">{averageRating}</div>
                      <StarRating rating={parseFloat(averageRating)} size="default" />
                      <div className="text-sm text-gray-600 mt-1">
                        {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              {description && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed line-clamp-6">
                    {description.replace(/<[^>]*>/g, '')}
                  </p>
                </div>
              )}

              {/* Additional Info */}
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
                {volumeInfo?.publishedDate && (
                  <span className="flex items-center gap-1">
                    📅 Published {volumeInfo.publishedDate}
                  </span>
                )}
                {volumeInfo?.pageCount && (
                  <span className="flex items-center gap-1">
                    📖 {volumeInfo.pageCount} pages
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="font-serif text-2xl font-bold mb-6 text-gray-900">
          Reader Reviews
        </h2>

        {reviewsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <BookIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600">No reviews yet. Be the first to review this book!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => {
              const isOwner = review.userId === currentUserId;
              const isEditing = editingReviewId === review._id;

              return (
                <div 
                  key={review._id} 
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  {isEditing ? (
                    // EDIT MODE
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {review.authorName || review.user?.name || 'Anonymous'}
                            </p>
                            <p className="text-sm text-gray-500">Editing review</p>
                          </div>
                        </div>
                      </div>

                      {/* Edit Rating */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rating
                        </label>
                        <InteractiveStarRating 
                          rating={editRating} 
                          onRatingChange={setEditRating}
                        />
                      </div>

                      {/* Edit Comment */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Review
                        </label>
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                          placeholder="Share your thoughts about this book..."
                        />
                      </div>

                      {/* Edit Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveEdit(review._id)}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                          <Check className="h-4 w-4" />
                          Save
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // VIEW MODE
                    <>
                      {/* Review Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {review.authorName || review.user?.name || 'Anonymous'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {formatDate(review.reviewedAt)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} size="small" />
                          {isOwner && (
                            <div className="flex gap-1 ml-2">
                              <button
                                onClick={() => handleStartEdit(review)}
                                className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                title="Edit review"
                                aria-label="Edit review"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteReview(review._id)}
                                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete review"
                                aria-label="Delete review"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Review Content */}
                      <p className="text-gray-700 leading-relaxed">
                        {review.comment}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;