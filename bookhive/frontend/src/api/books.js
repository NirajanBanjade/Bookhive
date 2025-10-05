export async function searchBooks({ q, keywords, searchType = "title", page = 1, limit = 20, signal }) {
  const params = new URLSearchParams({ q, keywords, searchType, page, limit });
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

  return res.json();
}
