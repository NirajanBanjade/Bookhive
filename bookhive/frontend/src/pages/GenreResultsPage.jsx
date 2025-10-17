import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GENRES, getGenreById } from "../constants/genre";
import axios from "axios";

/**
 * GenreResultsPage - Display books filtered by genre
 * 
 * CURRENT IMPLEMENTATION (Phase 1):
 * - Fetches books from Google Books API via backend proxy
 * - Filters by genre subject
 * - Basic pagination
 * 
 * FUTURE FEATURES (Phase 2 - Backend Team):
 * Backend should create: GET /api/books/genre/:genreId
 * 
 * Response should include:
 * {
 *   books: [...],           // Book list with our schema
 *   pagination: {...},      // hasMore, nextPage, total
 *   filters: {...},         // Available filter options
 *   trending: [...],        // Top 5 trending books in this genre
 *   friendsReading: [...]   // What friends are reading (if logged in)
 * }
 * 
 * FUTURE UI FEATURES TO ADD:
 * 1. Sort by: Newest, Popular, Rating, Title
 * 2. Filter by: Year range, Rating (3+ stars, 4+ stars)
 * 3. "Trending in Fantasy" section at top
 * 4. "Friends reading Fantasy" sidebar
 * 5. Save genre as favorite (heart icon)
 * 6. Book count badges on genre cards
 * 7. "More like this" recommendations
 * 
 * @component
 */
const GenreResultsPage = () => {
  const { genreId } = useParams();
  const genre = getGenreById(genreId);
  
  // State
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  // TODO Phase 2: Add these filter states when backend supports them
  // const [sortBy, setSortBy] = useState('relevance'); // 'newest', 'popular', 'rating'
  // const [minRating, setMinRating] = useState(0); // 0, 3, 4, 5
  // const [yearRange, setYearRange] = useState(null); // [2020, 2024]
  
  const userId = "user123"; // TODO: Get from auth context/Redux store

  /**
   * Fetch books for this genre
   * 
   * CURRENT: Uses existing /api/books/search endpoint with subject filter
   * FUTURE: Replace with dedicated /api/books/genre/:genreId endpoint
   * 
   * When backend is ready, change this to:
   * const response = await fetch(`/api/books/genre/${genreId}?page=${page}&sort=${sortBy}&minRating=${minRating}`);
   */
  useEffect(() => {
    if (!genre) return;

    const fetchGenreBooks = async () => {
      setLoading(true);
      setError("");

      try {
        // PHASE 1: Using existing search endpoint
        // Google Books API uses "subject" parameter for genre filtering
        const response = await fetch(
          `/api/books/search?keywords=${encodeURIComponent(genre.subject)}&searchType=both&page=${page}&limit=20`
        );
        
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();
        
        // Update books (append for pagination)
        if (page === 1) {
          setBooks(data.items || []);
        } else {
          setBooks(prev => [...prev, ...(data.items || [])]);
        }
        
        setHasMore(data.hasMore || false);

        // PHASE 2: When using dedicated endpoint, you'll get:
        // {
        //   books: [...],
        //   pagination: { hasMore, nextPage, totalResults },
        //   trending: [...],  // Use this for "Trending in [Genre]" section
        //   friendsReading: [...] // Use this for sidebar widget
        // }
        
      } catch (err) {
        setError(err.message || "Something went wrong");
        console.error("Genre fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreBooks();
  }, [genre, page]); // TODO Phase 2: Add sortBy, minRating to dependencies

  /**
   * Add book to user's to-read list
   * TODO Phase 2: Move this to a shared hook/service (useToReadList)
   * so it can be reused across SearchPage, GenrePage, etc.
   */
  const handleAddToRead = async (book) => {
    try {
      await axios.post(`http://localhost:5050/api/to-read/${userId}`, book);
      alert(`Added "${book.title}" to your To-Read list!`);
      
      // TODO Phase 2: Replace alert with toast notification
      // TODO Phase 2: Update UI to show "Added" state on button
      // TODO Phase 2: Dispatch Redux action if using state management
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add book");
    }
  };

  const onLoadMore = () => {
    if (loading || !hasMore) return;
    setPage(prev => prev + 1);
  };

  // Genre not found - 404 state
  if (!genre) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fafaf9' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Genre Not Found</h2>
          <p className="text-gray-600 mb-6">The genre you're looking for doesn't exist.</p>
          <Link 
            to="/genre" 
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            Browse All Genres
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#fafaf9' }}>
      {/* Genre Header */}
      <div className={`bg-gradient-to-br ${genre.color} border-b border-gray-200`}>
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Back Button */}
          <Link 
            to="/genre" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Genres
          </Link>
          
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="text-6xl">{genre.icon}</div>
              <div className="flex-1">
                <h1 className={`text-4xl font-bold mb-2 font-serif ${genre.textColor}`}>
                  {genre.name}
                </h1>
                <p className="text-lg text-gray-700">
                  {genre.description}
                </p>
              </div>
            </div>

            {/* TODO Phase 2: Add "Save Genre" button here */}
            {/* 
            <button className="px-4 py-2 bg-white rounded-lg border-2 border-gray-300 hover:border-primary transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            */}
          </div>
        </div>
      </div>

      {/* TODO Phase 2: Add Filters & Sort Bar */}
      {/* 
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="relevance">Most Relevant</option>
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="popular">Most Popular</option>
            </select>
            
            <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))}>
              <option value={0}>All Ratings</option>
              <option value={3}>3+ Stars</option>
              <option value={4}>4+ Stars</option>
            </select>
          </div>
        </div>
      </div>
      */}

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* TODO Phase 2: Add "Trending in [Genre]" section here */}
        {/* Show top 5 trending books as a horizontal scroll carousel */}

        {/* Loading State */}
        {loading && page === 1 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary"></div>
            <p className="mt-4 text-gray-600">Loading {genre.name} books...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">Error: {error}</p>
            <button 
              onClick={() => setPage(1)} 
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading && !error && books.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Books Found</h3>
            <p className="text-gray-600 mb-6">
              We couldn't find any books in this genre. Try another one!
            </p>
            <Link 
              to="/genre"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Browse Other Genres
            </Link>
          </div>
        )}

        {/* Book Grid */}
        {books.length > 0 && (
          <>
            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {books.length} {books.length === 1 ? 'Book' : 'Books'}
              </h2>
              
              {/* TODO Phase 2: Add view toggle (grid/list) here */}
            </div>

            {/* Book Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <div
                  key={book.googleBookId}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* Book Cover */}
                  <div className="aspect-[2/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <div className="text-5xl mb-2">{genre.icon}</div>
                        <p className="text-sm font-semibold text-gray-600 line-clamp-3">
                          {book.title}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Book Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-1">
                      {(book.authors || []).join(", ") || "Unknown Author"}
                    </p>

                    {/* TODO Phase 2: Add rating stars here if available */}
                    {/* {book.averageRating && <StarRating rating={book.averageRating} />} */}

                    {/* Add to To-Read Button */}
                    <button
                      onClick={() => handleAddToRead(book)}
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium"
                    >
                      Add to To-Read
                    </button>
                    
                    {/* TODO Phase 2: Add "Quick View" button that opens modal with book details */}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={onLoadMore}
                  disabled={loading}
                  className={`px-8 py-3 rounded-lg font-medium transition-all ${
                    loading
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary hover:shadow-md"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                      Loading More...
                    </span>
                  ) : (
                    "Load More Books"
                  )}
                </button>
              </div>
            )}

            {/* TODO Phase 2: Replace "Load More" with infinite scroll using Intersection Observer */}
          </>
        )}
      </div>

      {/* TODO Phase 2: Add right sidebar for "Friends Reading This Genre" */}
    </div>
  );
};

export default GenreResultsPage;
