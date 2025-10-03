// frontend/src/pages/SearchPage.jsx
import { useEffect, useRef, useState } from "react";
import { searchBooks } from "../api/books";

export default function SearchPage() { 
  const [title, setTitle] = useState("");
  const [keywords, setKeyword] = useState("");     
  const [q, setQ] = useState({ title: "", keywords: "" });            
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Debounce the input (300ms)
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);         // reset pagination on new query
      setQ({ title: title.trim(), keywords: keywords.trim() });
    }, 300);
    return () => clearTimeout(t);
  }, [title, keywords]);

  // Fetch whenever q.title, q.keywords, or page changes
  useEffect(() => {
    if (!q.title) {
      setItems([]);
      setHasMore(false);
      setNextPage(null);
      setError("");
      return;
    }

    const ac = new AbortController();
    setLoading(true);
    setError("");

    searchBooks({ ...q, page, limit: 12, signal: ac.signal })
      .then((data) => {
        // Replace on first page, append on subsequent pages
        setItems((prev) => (page === 1 ? data.items : [...prev, ...data.items]));
        setHasMore(Boolean(data.hasMore));
        setNextPage(data.nextPage ?? null);
      })
      .catch((e) => {
        if (e.name === "AbortError") return;
        setError(e.message || "Something went wrong.");
      })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [q, page]);

  const onLoadMore = () => {
    if (hasMore && nextPage) setPage(nextPage);
  };

  return (
    <div style={{ maxWidth: 860, margin: "32px auto", padding: "0 16px" }}>
      <h1 style={{ marginBottom: 12 }}>Search Books</h1>

      {/* Title search input */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Type a title (e.g., harry potter)…"
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #ddd",
          outline: "none",
        }}
      />

      {/* Keywords input */}
      <input
        value={keywords}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Type keywords separated by commas (e.g., magic, wizard)…"
        style={{width: "100%", marginButtom: 16}}
      />

      {/* States */}
      {loading && page === 1 && (
        <p style={{ marginTop: 16 }}>Loading…</p>
      )}
      {error && (
        <p style={{ marginTop: 16, color: "crimson" }}>Error: {error}</p>
      )}
      {q.title && !loading && items.length === 0 && !error && (
        <p style={{ marginTop: 16 }}>No results for “{q.title}”.</p>
      )}

      {/* Results */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginTop: 16 }}>
        {items.map((b) => (
          <div key={b.googleBookId} style={{ display: "flex", gap: 12, padding: 12, border: "1px solid #eee", borderRadius: 10 }}>
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

      {/* Load More */}
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
            {loading && page > 1 ? "Loading…" : hasMore ? "Load More" : "No more results"}
          </button>
        </div>
      )}
    </div>
  );
}
