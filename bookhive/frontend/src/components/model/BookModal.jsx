import React, { useState, useEffect } from 'react';
import { X, Book as BookIcon, Star, Loader2 } from 'lucide-react';
import { getBookById } from '../../api/books';
import './BookModal.css';

const BookModal = ({ googleBookId, onClose }) => {
  const [bookInfo, setBookInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookInfo = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getBookById(googleBookId);
        setBookInfo(data);
      } catch (err) {
        console.error('Error fetching book info:', err);
        setError(err.message || 'Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    if (googleBookId) {
      fetchBookInfo();
    }
  }, [googleBookId]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!googleBookId) return null;

  const { volumeInfo, book } = bookInfo || {};
  const thumbnail = volumeInfo?.imageLinks?.thumbnail || volumeInfo?.imageLinks?.smallThumbnail || book?.thumbnail;
  const title = volumeInfo?.title || book?.title || 'Unknown Title';
  const authors = volumeInfo?.authors || book?.authors || ['Unknown Author'];
  const description = volumeInfo?.description;
  const publishedDate = volumeInfo?.publishedDate;
  const pageCount = volumeInfo?.pageCount;

  return (
    <div className="book-modal-overlay" onClick={onClose}>
      <div className="book-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button onClick={onClose} className="book-modal-close">
          <X className="h-6 w-6" />
        </button>

        {loading ? (
          <div className="book-modal-loading">
            <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
            <p className="mt-4 text-gray-600">Loading book details...</p>
          </div>
        ) : error ? (
          <div className="book-modal-error">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        ) : (
          <div className="book-modal-body">
            {/* Book Cover & Info */}
            <div className="book-modal-header">
              <div className="book-modal-cover">
                {thumbnail ? (
                  <img 
                    src={thumbnail.replace('http:', 'https:')}
                    alt={title}
                  />
                ) : (
                  <div className="book-modal-cover-placeholder">
                    <BookIcon className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>

              <div className="book-modal-info">
                <h2 className="book-modal-title">{title}</h2>
                <p className="book-modal-author">
                  by {Array.isArray(authors) ? authors.join(', ') : authors}
                </p>

                {/* Meta Info */}
                <div className="book-modal-meta">
                  {publishedDate && (
                    <span className="book-modal-meta-item">
                      📅 Published {publishedDate}
                    </span>
                  )}
                  {pageCount && (
                    <span className="book-modal-meta-item">
                      📖 {pageCount} pages
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {description && (
              <div className="book-modal-description">
                <h3 className="book-modal-description-title">Description</h3>
                <p className="book-modal-description-text">
                  {description.replace(/<[^>]*>/g, '')}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookModal;