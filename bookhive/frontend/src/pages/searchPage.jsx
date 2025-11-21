// frontend/src/pages/SearchPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchBooks } from "../api/books";
import axios from "axios";
import MatureContentWarning from "../components/model/MatureContentWarning";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlQuery = searchParams.get("q") || "";
  const [query, setQuery] = useState(urlQuery);
  const [q, setQ] = useState({ title: "", keywords: "" });
  const [searchType, setSearchType] = useState("both");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // FIXED: Get real userId from logged-in user
  const [userId, setUserId] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isMinor, setIsMinor] = useState(false);

  // Fetch logged-in user ID and check if minor
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const response = await axios.get("http://localhost:5050/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserId(response.data._id || response.data.id);

        const minorStatus = localStorage.getItem("isMinor");
        setIsMinor(minorStatus === "true");
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchUser();
  }, []);

  // Auto-search when URL query changes
  useEffect(() => {
    if (urlQuery) {
      setQuery(urlQuery);
      setQ({ title: urlQuery, keywords: urlQuery });
    }
  }, [urlQuery]);

  // Debounce the input (300ms) → feed BOTH title & keywords
  useEffect(() => {
    const t = setTimeout(() => {
      const v = (query || "").trim();
      setPage(1);
      setQ({ title: v, keywords: v });
      // Update URL when user types
      if (v) {
        setSearchParams({ q: v });
      } else {
        setSearchParams({});
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query, setSearchParams]);

  // Fetch whenever q/searchType/page change
  useEffect(() => {
    if (!q.title && !q.keywords) {
      setItems([]);
      setHasMore(false);
      setNextPage(null);
      setError("");
      return;
    }

    const ac = new AbortController();
    setLoading(true);
    setError("");

    searchBooks({
      title: q.title,
      keywords: q.keywords,
      searchType,
      page,
      limit: 12,
      signal: ac.signal,
    })
      .then((data) => {
        setItems((prev) =>
          page === 1 ? data.items : [...prev, ...data.items]
        );
        setHasMore(Boolean(data.hasMore));
        setNextPage(data.nextPage ?? null);
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setError(e.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [q, searchType, page]);

  const onLoadMore = () => {
    if (loading || !hasMore) return;
    const target = nextPage ?? page + 1;
    setPage(target);
  };

  const handleAddToRead = async (book) => {
    if (!userId) {
      alert("Please login first");
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
      await axios.post(`http://localhost:5050/api/to-read/${userId}`, book);

      // Trigger notification refresh
      window.dispatchEvent(new Event("notifications:refresh"));

      alert(`Added "${book.title}" to your To-Read list!`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-400 to-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Search Books</h1>
          <p className="text-gray-400">Discover your next favorite read</p>
        </div>

        {/* Search Controls */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700 shadow-lg">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title or keywords…"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
              />
            </div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
            >
              <option value="both">Both</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && page === 1 && (
          <div className="flex justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="animate-spin h-8 w-8 border-2 border-amber-500 border-t-transparent rounded-full"></div>
              <p className="text-gray-500">Searching for books...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-6">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {/* No Results */}
        {(q.title || q.keywords) &&
          !loading &&
          items.length === 0 &&
          !error && (
            <div className="text-center py-12">
              <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No books found
                </h3>
                <p className="text-gray-400">
                  No results for "{q.title || q.keywords}". Try different
                  keywords.
                </p>
              </div>
            </div>
          )}

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((book) => (
            <div
              key={book.googleBookId}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300 group"
            >
              {/* Book Cover and Info */}
              <div className="p-4">
                <div className="flex gap-4 mb-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    {book.thumbnail ? (
                      <img
                        src={book.thumbnail}
                        alt={book.title}
                        className="w-16 h-24 object-cover rounded-lg shadow-md"
                      />
                    ) : (
                      <div className="w-16 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📖</span>
                      </div>
                    )}
                  </div>

                  {/* Book Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif font-semibold text-white mb-1 line-clamp-2 group-hover:text-amber-400 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      {(book.authors || []).join(", ") || "Unknown author"}
                    </p>

                    {/* Mature Content Badge */}
                    {book.maturityRating === "MATURE" && (
                      <span className="inline-block px-2 py-1 text-xs font-semibold bg-red-900/50 text-red-400 rounded-full border border-red-700">
                        Mature Content
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to To-Read Button */}
                <button
                  onClick={() => handleAddToRead(book)}
                  disabled={!userId}
                  className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${
                    userId
                      ? "bg-gradient-to-r from-amber-400 to-orange-800 text-white hover:from-amber-00 hover:to-orange-400 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-amber-400"
                      : "bg-gray-600 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {userId ? "Add to To-Read" : "Login to Add"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {items.length > 0 && (
          <div className="mt-12 text-center">
            <button
              onClick={onLoadMore}
              disabled={!hasMore || loading}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-200 ${
                hasMore && !loading
                  ? "bg-gray-800 border border-gray-600 text-gray-200 hover:bg-gray-700 hover:border-amber-500 hover:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  : "bg-gray-900 border border-gray-800 text-gray-600 cursor-not-allowed"
              }`}
            >
              {loading && page > 1 ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-amber-500 border-t-transparent rounded-full"></div>
                  Loading...
                </div>
              ) : hasMore ? (
                "Load More Books"
              ) : (
                "No more results"
              )}
            </button>
          </div>
        )}

        {/* Mature Content Warning Modal */}
        <MatureContentWarning
          isOpen={showWarning}
          onClose={handleWarningDecline}
          onAccept={handleWarningAccept}
          bookTitle={selectedBook?.title || ""}
        />
      </div>
    </div>
  );
}
