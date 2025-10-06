// frontend/src/pages/SearchPage.jsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchBooks } from "../api/books";
import axios from "axios";

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
  const userId = "user123"; // replace with actual logged-in user ID

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
    const target = nextPage ?? (page + 1);    
    setPage(target);
  };

  // Add to To-Read list (from your friend's code)
  const handleAddToRead = async (book) => {
    try {
      await axios.post(`http://localhost:5050/api/to-read/${userId}`, book);
      alert(`Added "${book.title}" to your To-Read list!`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Books</h1>

      {/* Refined Search - Works with navbar search */}
      <div className="flex gap-3 mb-6">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or keywords…"
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="both">Both</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
        </select>
      </div>

      {loading && page === 1 && <p className="text-gray-600">Loading…</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      {(q.title || q.keywords) && !loading && items.length === 0 && !error && (
        <p className="text-gray-600">
          No results for "{q.title || q.keywords}".
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {items.map((b) => (
          <div
            key={b.googleBookId}
            className="flex flex-col gap-3 p-3 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex gap-3">
              {b.thumbnail ? (
                <img
                  src={b.thumbnail}
                  alt={b.title}
                  className="w-16 h-24 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-24 bg-gray-100 rounded" />
              )}
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {b.title}
                </div>
                <div className="text-sm text-gray-600">
                  {(b.authors || []).join(", ") || "Unknown author"}
                </div>
              </div>
            </div>

            {/* Add to To-Read button (from your friend's code) */}
            <button
              onClick={() => handleAddToRead(b)}
              className="w-full px-3 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              Add to To-Read
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div className="mt-6">
          <button
            onClick={onLoadMore}
            disabled={!hasMore || loading}
            className={`px-6 py-2 rounded-lg border ${
              hasMore && !loading
                ? "bg-white border-gray-300 hover:bg-gray-50 cursor-pointer"
                : "bg-gray-100 border-gray-200 cursor-not-allowed text-gray-500"
            }`}
          >
            {loading && page > 1
              ? "Loading…"
              : hasMore
              ? "Load More"
              : "No more results"}
          </button>
        </div>
      )}
    </div>
  );
}
