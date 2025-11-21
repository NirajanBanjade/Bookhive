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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div
          className="text-center p-12 rounded-2xl border"
          style={{
            backgroundColor: "rgba(31, 41, 55, 0.6)",
            borderColor: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.4)",
          }}
        >
          <div className="text-6xl mb-4">📚</div>
          <h2
            className="text-2xl font-bold mb-2 text-white"
            style={{
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Genre Not Found
          </h2>
          <p
            className="mb-6 text-gray-400"
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
          >
            The genre you're looking for doesn't exist.
          </p>
          <Link
            to="/genre"
            className="inline-block px-6 py-3 rounded-lg font-medium transition-all bg-amber-500 text-white hover:bg-amber-600"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Genre Header */}
      <div
        className="border-b"
        style={{
          backgroundColor: genre.bgColor,
          borderColor: "rgba(0,0,0,0.2)",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Link
            to="/genre"
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors text-gray-700 hover:text-gray-900"
            style={{
              fontFamily: "'Inter', sans-serif",
            }}
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

          <div className="flex items-start gap-6">
            {/* Icon with background */}
            <div
              className="p-5 rounded-2xl border"
              style={{
                backgroundColor: "rgba(255,255,255,0.3)",
                borderColor: "rgba(255,255,255,0.2)",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              <IconComponent
                size={64}
                strokeWidth={2}
                color={genre.titleColor}
              />
            </div>

            <div className="flex-1">
              <h1
                className="text-5xl font-bold mb-3"
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

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading && page === 1 && (
          <div className="text-center py-20">
            <div
              className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-transparent"
              style={{
                borderColor: `${genre.titleColor}33`,
                borderTopColor: genre.titleColor,
              }}
            ></div>
            <p
              className="mt-6 text-gray-400"
              style={{
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Loading {genre.name} books...
            </p>
          </div>
        )}

        {error && !loading && (
          <div
            className="rounded-2xl p-8 text-center border"
            style={{
              backgroundColor: "rgba(127, 29, 29, 0.3)",
              borderColor: "rgba(248, 113, 113, 0.5)",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            }}
          >
            <p
              className="font-medium mb-4 text-red-400"
              style={{
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Error: {error}
            </p>
            <button
              onClick={() => setPage(1)}
              className="px-6 py-2 rounded-lg font-medium transition-colors bg-red-600 text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="text-center py-20">
            <div className="mb-6">
              <IconComponent
                size={80}
                strokeWidth={1.5}
                color={genre.titleColor}
                className="mx-auto"
              />
            </div>
            <h3
              className="text-3xl font-bold mb-3 text-white"
              style={{
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              No Books Found
            </h3>
            <p
              className="mb-8 text-gray-400"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "1.125rem",
              }}
            >
              We couldn't find any books in this genre. Try another one!
            </p>
            <Link
              to="/genre"
              className="inline-block px-6 py-3 rounded-lg font-medium transition-all bg-amber-500 text-white hover:bg-amber-600"
            >
              Browse Other Genres
            </Link>
          </div>
        )}

        {books.length > 0 && (
          <>
            <div className="mb-8 flex items-center justify-between">
              <h2
                className="text-2xl font-bold text-white"
                style={{
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {books.length} {books.length === 1 ? "Book" : "Books"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <div
                  key={book.googleBookId}
                  className="rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-2 group"
                  style={{
                    backgroundColor: "rgba(31, 41, 55, 0.6)",
                    borderColor: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(10px)",
                    boxShadow:
                      "0 4px 6px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0, 0, 0, 0.4), 0 20px 40px rgba(0, 0, 0, 0.2)";
                    e.currentTarget.style.borderColor =
                      "rgba(251, 191, 36, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 6px rgba(0, 0, 0, 0.3), 0 10px 20px rgba(0, 0, 0, 0.15)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  }}
                >
                  <div className="aspect-[2/3] bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center p-4">
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-center p-6">
                        <div className="mb-3 flex justify-center">
                          <IconComponent
                            size={48}
                            strokeWidth={1.5}
                            color={genre.titleColor}
                          />
                        </div>
                        <p
                          className="text-sm font-semibold line-clamp-3 text-gray-400"
                          style={{
                            fontFamily: "'Inter', sans-serif",
                          }}
                        >
                          {book.title}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3
                      className="font-bold mb-1 line-clamp-2 min-h-[3rem] text-white group-hover:text-amber-400 transition-colors"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {book.title}
                    </h3>
                    <p
                      className="text-sm mb-3 line-clamp-1 text-gray-400"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      {(book.authors || []).join(", ") || "Unknown Author"}
                    </p>

                    {/* Show mature badge */}
                    {book.maturityRating === "MATURE" && (
                      <span
                        className="inline-block mb-3 px-2 py-1 text-xs font-semibold rounded border"
                        style={{
                          backgroundColor: "rgba(127, 29, 29, 0.3)",
                          color: "#f87171",
                          borderColor: "rgba(248, 113, 113, 0.5)",
                        }}
                      >
                        Mature Content
                      </span>
                    )}

                    <button
                      onClick={() => handleAddToRead(book)}
                      disabled={!userId}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        userId
                          ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700 hover:shadow-lg"
                          : "bg-gray-700 text-gray-500 cursor-not-allowed"
                      }`}
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
                  className={`px-8 py-3 rounded-lg font-medium transition-all border ${
                    loading
                      ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-amber-500 hover:text-amber-400 hover:shadow-lg"
                  }`}
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    boxShadow: loading
                      ? "none"
                      : "0 4px 6px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                        style={{
                          borderColor: "#6b7280",
                          borderTopColor: "transparent",
                        }}
                      ></div>
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
