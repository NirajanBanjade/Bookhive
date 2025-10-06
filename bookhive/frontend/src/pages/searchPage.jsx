// frontend/src/pages/SearchPage.jsx
import { useEffect, useState } from "react";
import { searchBooks } from "../api/books";
import axios from "axios";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [q, setQ] = useState({ title: "", keywords: "" });
  const [searchType, setSearchType] = useState("both");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = "user123"; // replace with actual logged-in user ID

  // Debounce the input (300ms) → feed BOTH title & keywords
  useEffect(() => {
    const t = setTimeout(() => {
      const v = (query || "").trim();
      setPage(1);
      setQ({ title: v, keywords: v });
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

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
        setItems((prev) => (page === 1 ? data.items : [...prev, ...data.items]));

        setHasMore(Boolean(data.hasMore));
        setNextPage(data.nextPage ?? null);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [q, searchType, page]); // keep searchType & page here

  const onLoadMore = () => {
    if (loading || !hasMore) return;          
    const target = nextPage ?? (page + 1);    
    setPage(target);
  };

  // Add to To-Read list
  const handleAddToRead = async (book) => {
    try {
      await axios.post(`http://localhost:5000/api/to-read/${userId}`, book);
      alert(`Added "${book.title}" to your To-Read list!`);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to add book");
    }
  };

  return (
    <div style={{ maxWidth: 860, margin: "32px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 12 }}>Search Books</h1>

      {/* Input + dropdown (optional UI for searchType) */}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or keywords…"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ddd",
            outline: "none",
          }}
          aria-label="Search query" 
        />
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: 6,
            border: "1px solid #ddd",
          }}
          aria-label="Search type" 
        >
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="both">Both</option>
        </select>
      </div>

      {loading && page === 1 && <p style={{ marginTop: 16 }}>Loading…</p>}
      {error && <p style={{ marginTop: 16, color: "crimson" }}>Error: {error}</p>}
      {(q.title || q.keywords) && !loading && items.length === 0 && !error && (
        <p style={{ marginTop: 16 }}>
          No results for “{q.title || q.keywords}”.
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 12,
          marginTop: 16,
        }}
      >
        {items.map((b) => (
          <div
            key={b.googleBookId}
            style={{
              display: "flex",
              gap: 12,
              padding: 12,
              border: "1px solid #eee",
              borderRadius: 10,
              flexDirection: "column", // make column so button appears below info
            }}
          >
            {b.thumbnail ? (
              <img src={b.thumbnail} alt={b.title} width={60} height={90} />
            ) : (
              <div style={{ width: 60, height: 90, background: "#f4f4f4" }} />
            )}
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{b.title}</div>
              <div style={{ color: "#555", fontSize: 14 }}>
                {(b.authors || []).join(", ") || "Unknown author"}
              </div>
            </div>

            <button
              onClick={() => handleAddToRead(b)}
              style={{
                marginTop: 8,
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #ddd",
                cursor: "pointer",
              }}
              aria-label={`Add ${b.title} to To-Read`} 
            >
              Add to To-Read
            </button>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <button
            onClick={onLoadMore}
            disabled={!hasMore || loading}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: hasMore && !loading ? "#fff" : "#f3f3f3",
              cursor: hasMore && !loading ? "pointer" : "not-allowed",
            }}
            aria-label="Load more results" 
          >
            {loading && page > 1 ? "Loading…" : hasMore ? "Load More" : "No more results"}
          </button>
        </div>
      )}
    </div>
  );
}
