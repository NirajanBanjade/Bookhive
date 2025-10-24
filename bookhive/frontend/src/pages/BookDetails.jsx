import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Book as BookIcon } from 'lucide-react';
import { getBookById } from '../api/books';

const BookDetails = () => {
  const { googleBookId } = useParams();
  const [bookInfo, setBookInfo] = useState(null);
  const [loading, setLoading] = useState(true);
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

              {/* Description */}
              {description && (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed">
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

      {/* Placeholder for reviews - will add in next step */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <p className="text-gray-500 text-center">Reviews section coming next...</p>
      </div>
    </div>
  );
};

export default BookDetails;