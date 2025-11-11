// frontend/src/api/books.js
export async function searchBooks({
  title,
  keywords,
  searchType,
  page = 1,
  limit = 20,
  signal,
}) {
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
  const inferredHasMore = data.hasMore ?? inferredNext != null;
  return {
    ...data,
    nextPage: inferredNext,
    hasMore: inferredHasMore,
  };
}

// 🆕 NEW FUNCTION - Get trending books from NYT Bestsellers
export async function getTrendingBooks({ limit = 10, signal } = {}) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));

  const res = await fetch(`/api/books/trending?${params.toString()}`, {
    signal,
  });

  if (!res.ok) {
    let errMsg = `Failed to fetch trending books: ${res.status}`;
    try {
      const errData = await res.json();
      if (errData?.error) errMsg = errData.error;
    } catch {
      // ignore JSON parse error
    }
    throw new Error(errMsg);
  }

  return await res.json();
}

// 🆕 NEW FUNCTION - Get personalized book recommendations for a user
export async function getRecommendedForUser({ userId, limit = 12, signal } = {}) {
  if (!userId) throw new Error("userId is required");
  const params = new URLSearchParams();
  params.set("userId", userId);
  params.set("limit", String(limit));

  const res = await fetch(`/api/recommendations/ranked?${params.toString()}`, { signal, credentials: "include" });
  if (!res.ok) {
    let errMsg = `Failed to fetch recommendations: ${res.status}`;
    try {
      const errData = await res.json();
      if (errData?.error) errMsg = errData.error;
    } catch {}
    throw new Error(errMsg);
  }
  return await res.json(); // { ok, reason, count, items: [...] }
}

// Get single book by googleBookId
export async function getBookById(googleBookId, { signal } = {}) {
  if (!googleBookId) throw new Error("googleBookId is required");

  const res = await fetch(`/api/books/${googleBookId}`, { signal });

  if (!res.ok) {
    let errMsg = `Failed to fetch book: ${res.status}`;
    try {
      const errData = await res.json();
      if (errData?.error) errMsg = errData.error;
    } catch {
      // ignore JSON parse error
    }
    throw new Error(errMsg);
  }

  return await res.json();
}

export async function rebuildUserProfile({ userId, signal } = {}) {
  if (!userId) throw new Error("userId is required");

  const res = await fetch(`/api/recommendations/profile/rebuild`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
    signal,
    credentials: "include", // if you're using cookies/session
  });

  let data;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    let errMsg = `Failed to rebuild profile: ${res.status}`;
    if (data?.error) errMsg = data.error;
    throw new Error(errMsg);
  }

  return data; // { ok: true, profile, warnings: [...] }
}