// frontend/src/api/books.js
export async function searchBooks({ title, keywords, searchType, page = 1, limit = 20, signal }) {
  const params = new URLSearchParams();

  const t = (title ?? "").trim();
  const k = (keywords ?? "").trim();

  if (t) params.set("title", t);
  if (k) params.set("keywords", k);
  if (searchType) params.set("searchType", searchType);
  params.set("page", String(page));
  params.set("limit", String(limit));

  const res = await fetch(`/api/books/search?${params.toString()}`, { signal });

  if (!res.ok) {
    let errMsg = `Search failed with ${res.status}`;
    try {
      const errData = await res.json();
      if (errData?.error) errMsg = errData.error;
    } catch {
      // ignore JSON parse error
    }
    throw new Error(errMsg);
  }


  const data = await res.json();
  const size = Array.isArray(data.items) ? data.items.length : 0;
  const inferredNext = data.nextPage ?? (size === limit ? page + 1 : null);
  const inferredHasMore = data.hasMore ?? (inferredNext != null);

  return {
    ...data,               
    nextPage: inferredNext,
    hasMore: inferredHasMore,
  };
}
