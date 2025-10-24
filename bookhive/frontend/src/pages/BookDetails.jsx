import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getReviewsByBook } from '../services/reviewsService';

// Show reviews for a book
const BookDetails = () => {
  const { googleBookId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews when page loads
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const data = await getReviewsByBook(googleBookId);
        setReviews(data || []);
      } catch (error) {
        console.log('Error getting reviews:', error);
        setReviews([]);
      }
      setLoading(false);
    };
    fetchReviews();
  }, [googleBookId]);

  return (
    <div>
      <h1>Book Details for {googleBookId}</h1>
      {loading ? (
        <p>Loading...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        <div>
          {reviews.map((review) => (
            <div key={review._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
              <p>{review.authorName || 'Anonymous'} - {review.rating} stars</p>
              <p>{review.comment}</p>
              <p>{new Date(review.reviewedAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookDetails;