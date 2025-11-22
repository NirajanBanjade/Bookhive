import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { GENRES, getGenreById } from "../constants/genre";
import axios from "axios";
import MatureContentWarning from "../components/model/MatureContentWarning";

const GenreResultsPage = () => {
  const { genreId } = useParams();
  const genre = getGenreById(genreId);

  // State
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [userId, setUserId] = useState(null);

  // Mature content warning state
  const [showWarning, setShowWarning] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isMinor, setIsMinor] = useState(false);

  // Fetch current user ID and check if minor
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch("http://localhost:5050/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const user = await response.json();
          setUserId(user._id || user.id);

          // Check if user is a minor
          const minorStatus = localStorage.getItem("isMinor");
          setIsMinor(minorStatus === "true");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    if (!genre) return;

    const fetchGenreBooks = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `/api/books/genre/${genreId}?page=${page}&limit=20`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();

        if (page === 1) {
          setBooks(data.items || []);
        } else {
          setBooks((prev) => [...prev, ...(data.items || [])]);
        }

        setHasMore(data.hasMore || false);
      } catch (err) {
        setError(err.message || "Something went wrong");
        console.error("Genre fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGenreBooks();
  }, [genre, page, genreId]);

  // Check for mature content before adding
  const handleAddToRead = async (book) => {
    if (!userId) {
      alert("Please log in to add books to your reading list");
      return;
    }

    // Check if book is mature and user is a minor
    if (isMinor && book.maturityRating === "MATURE") {
      // Check if user has opted to skip warnings
      if (localStorage.getItem("skipMatureWarnings") === "true") {
        await addBookToRead(book);
        return;
      }

      setSelectedBook(book);
      setShowWarning(true);
      return;
    }

    // If not mature or user is adult, add directly
    await addBookToRead(book);
  };

  // Handle warning acceptance
  const handleWarningAccept = async () => {
    setShowWarning(false);
    if (selectedBook) {
      await addBookToRead(selectedBook);
      setSelectedBook(null);
    }
  };

  // Handle warning decline
  const handleWarningDecline = () => {
    setShowWarning(false);
    setSelectedBook(null);
  };

  // Actual function to add book to To-Read
  const addBookToRead = async (book) => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `http://localhost:5050/api/to-read/${userId}`,
        {
          googleBookId: book.googleBookId,
          title: book.title,
          authors: book.authors || [],
          thumbnail: book.thumbnail,
          categories: book.categories || [],
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(`Added "${book.title}" to your To-Read list!`);

      // Trigger notification refresh
      window.dispatchEvent(new Event("notifications:refresh"));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add book");
    }
  };

  const onLoadMore = () => {
    if (loading || !hasMore) return;
    setPage((prev) => prev + 1);
  };

  if (!genre) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ backgroundColor: "#fafaf9" }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Genre Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The genre you're looking for doesn't exist.
          </p>
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

  // Get the icon component
  const IconComponent = genre.icon;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafaf9" }}>
      {/* Genre Header */}
      <div
        className="border-b border-gray-200"
        style={{ backgroundColor: genre.bgColor }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Link
            to="/genre"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-4"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Genres
          </Link>

          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              {/* Icon with background */}
              <div
                className="p-4 rounded-xl"
                style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
              >
                <IconComponent
                  size={64}
                  strokeWidth={1.5}
                  color={genre.titleColor}
                />
              </div>

              <div className="flex-1">
                <h1
                  className="text-4xl font-bold mb-2 font-serif"
                  style={{
                    color: genre.titleColor,
                    fontFamily: "'Poppins', 'Arial', sans-serif",
                  }}
                >
                  {genre.name}
                </h1>
                <p
                  className="text-lg"
                  style={{
                    color: genre.descColor,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {genre.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading && page === 1 && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary"></div>
            <p className="mt-4 text-gray-600">Loading {genre.name} books...</p>
          </div>
        )}

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

        {!loading && !error && books.length === 0 && (
          <div className="text-center py-12">
            <div className="mb-4">
              <IconComponent
                size={64}
                strokeWidth={1.5}
                color={genre.titleColor}
                className="mx-auto"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No Books Found
            </h3>
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

        {books.length > 0 && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {books.length} {books.length === 1 ? "Book" : "Books"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <div
                  key={book.googleBookId}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-[2/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <div className="mb-2 flex justify-center">
                          <IconComponent
                            size={48}
                            strokeWidth={1.5}
                            color={genre.titleColor}
                          />
                        </div>
                        <p className="text-sm font-semibold text-gray-600 line-clamp-3">
                          {book.title}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 min-h-[3rem]">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                      {(book.authors || []).join(", ") || "Unknown Author"}
                    </p>

                    {/* Show mature badge */}
                    {book.maturityRating === "MATURE" && (
                      <span className="inline-block mb-2 px-2 py-0.5 text-xs font-semibold bg-red-100 text-red-800 rounded">
                        Mature Content
                      </span>
                    )}

                    <button
                      onClick={() => handleAddToRead(book)}
                      disabled={!userId}
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {userId ? "Add to To-Read" : "Login to Add"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

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
          </>
        )}
      </div>

      {/* Mature Content Warning Modal */}
      <MatureContentWarning
        isOpen={showWarning}
        onClose={handleWarningDecline}
        onAccept={handleWarningAccept}
        bookTitle={selectedBook?.title || ""}
      />
    </div>
  );
};

export default GenreResultsPage;
