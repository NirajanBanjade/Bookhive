// frontend/src/pages/SearchPage.jsx
import { useEffect, useState } from "react";
import { searchBooks } from "../api/books";

// Any token with ≥3 letters counts as meaningful (auto-search)
const hasMeaningfulToken = (s) => {
  const cleaned = (s || "").replace(/[^a-z0-9\s]/gi, " ").trim();
  if (!cleaned) return false;
  return cleaned.split(/\s+/).some((t) => /[a-z]{3,}/i.test(t));
};

export default function SearchPage() {
  const [typed, setTyped] = useState("");
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounce input: auto-search when there's any ≥3-letter word
  useEffect(() => {
    const t = setTimeout(() => {
      const val = typed.trim();
      setPage(1);
      setQ(hasMeaningfulToken(val) ? val : ""); // auto-fire for single real words too
    }, 300);
    return () => clearTimeout(t);
  }, [typed, keywords]);

  // Fetch whenever q, keywords, or page changes
  useEffect(() => {
    if (!q.q) { // no title/author query
      setItems([]);
      setHasMore(false);
      setNextPage(null);
      setError("");
      return;
    }

    const ac = new AbortController();
    setLoading(true);
    setError("");

    searchBooks({ ...q, searchType, page, limit: 12, signal: ac.signal })
      .then((data) => {
        setItems((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
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
    if (hasMore && nextPage) setPage(nextPage);
  };

  return (
    <div style={{ maxWidth: 860, margin: "32px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 12 }}>Search Books</h1>

      {/* Title search input */}
      <input
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        placeholder="Enter a keyword (≥3 letters)…"
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #ddd",
          outline: "none",
        }}
      />

      {/* Hint when input isn't meaningful yet */}
      {typed && !hasMeaningfulToken(typed) && (
        <p style={{ marginTop: 8, opacity: 0.7 }}>
          Enter a keyword with at least 3 letters. Results load automatically.
        </p>
      )}

      {loading && page === 1 && <p style={{ marginTop: 16 }}>Loading…</p>}
      {error && <p style={{ marginTop: 16, color: "crimson" }}>Error: {error}</p>}
      {q && !loading && items.length === 0 && !error && (
        <p style={{ marginTop: 16 }}>No results for “{q}”.</p>
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
