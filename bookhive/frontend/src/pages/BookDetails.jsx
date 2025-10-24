import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Book as BookIcon, Star, User } from 'lucide-react';
import { getBookById } from '../api/books';
import { getReviewsByBook, calculateAverageRating } from '../services/reviewsService';

const BookDetails = () => {
  const { googleBookId } = useParams();
  const [bookInfo, setBookInfo] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Star Rating Component
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
            {reviews.map((review) => (
              <div 
                key={review._id} 
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
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
                  <StarRating rating={review.rating} size="small" />
                </div>

                {/* Review Content */}
                <p className="text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;