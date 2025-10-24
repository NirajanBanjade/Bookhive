// controllers/bookController.js
const { searchVolumes, mapToToReadBook, getVolume } = require('../services/googleBooks');
const {
  getGenreQuery,
  resolveGenreAlias,
} = require("../constants/genreMapping");
const { getBestsellerList } = require("../services/nytBestsellers");
const Collection = require("../models/Collection");

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

function makeCacheKey({ qRaw, searchType, keywords, page, limit }) {
  return `${searchType}|${qRaw}|${keywords}|${page}|${limit}`;
}

async function searchBooks(req, res) {
  try {
    const { searchType = 'title' } = req.query;                           
    const qRaw = (req.query.q || req.query.title || req.query.keywords || '').trim(); 
    const keywords = (req.query.keywords || '').trim();

    if (!qRaw) {
      return res.status(400).json({ error: 'Please input a search' });
    }

    const page = clamp(parseInt(req.query.page || '1', 10) || 1, 1, 1_000_000);
    const limit = clamp(parseInt(req.query.limit || '20', 10) || 20, 1, 40);
    const startIndex = (page - 1) * limit;

    let finalQ = '';
    if (searchType === 'title') {
      finalQ = `intitle:${qRaw}`;
    } else if (searchType === 'author') {
      finalQ = `inauthor:${qRaw}`;
    } else if (searchType === 'both') {
      finalQ = qRaw;
    } else {
      finalQ = qRaw;
    }

    const cacheKey = makeCacheKey({ qRaw, searchType, keywords, page, limit });

    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`Cache hit for: ${cacheKey}`);
        return res.json(cached.data);
      } else {
        cache.delete(cacheKey);
      }
    }

    console.log(`Cache miss. Searching Google Books for: "${finalQ}", keywords: "${keywords}", page: ${page}, limit: ${limit}`);

    const data = await searchVolumes(finalQ, { startIndex, maxResults: limit });
    let rawItems = data.items || [];

    if (keywords) {
      const kws = keywords.split(',').map(kw => kw.trim().toLowerCase()).filter(Boolean);
      rawItems = rawItems.filter(volume => {
        const desc = (volume.volumeInfo?.description || '').toLowerCase();
        return kws.every(kw => desc.includes(kw));
      });
    }

    const items = rawItems.map(mapToToReadBook);
    const total = typeof data.totalItems === 'number' ? data.totalItems : items.length;
    const rawTotalPages = Math.max(Math.ceil(total / limit), 1);
    const MAX_PAGES = 50;
    const totalPages = Math.min(rawTotalPages, MAX_PAGES);
    const hasMore = page < rawTotalPages;
    const nextPage = hasMore ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    const responseData = {
      q: qRaw,                 
      searchType,
      keywords,
      finalQ,
      page,
      limit,
      total,
      totalPages,
      hasMore,
      nextPage,
      prevPage,
      items
    };

    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });
    return res.json(responseData);
  } catch (err) {
    console.error('Books search error:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'server error' });
  }
}

async function getTrendingBooks(req, res) {
  try {
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || '10', 10)));
    const cacheKey = `trending_nyt_${limit}`;

    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      const TRENDING_CACHE_TTL = 1000 * 60 * 60 * 6;
      if (Date.now() - cached.timestamp < TRENDING_CACHE_TTL) {
        console.log('Cache hit for trending books');
        return res.json(cached.data);
      } else {
        cache.delete(cacheKey);
      }
    }

    console.log('Fetching trending books from NYT Bestsellers...');
    const bestsellers = await getBestsellerList('combined-print-and-e-book-fiction');
    const limitedBooks = bestsellers.slice(0, limit);

    const responseData = {
      trending: limitedBooks,
      count: limitedBooks.length,
      source: 'NYT Bestsellers',
      calculatedAt: new Date().toISOString()
    };

    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });
    return res.json(responseData);
  } catch (err) {
    console.error('Trending books error:', err);
    return res.status(500).json({
      error: 'Failed to fetch trending books',
      trending: [],
      count: 0
    });
  }
}

async function getBooksByGenre(req, res) {
  try {
    const genreId = resolveGenreAlias(req.params.subject);
    const page = clamp(parseInt(req.query.page || "1", 10) || 1, 1, 1_000_000);
    const limit = clamp(parseInt(req.query.limit || "20", 10) || 20, 1, 40);
    const startIndex = (page - 1) * limit;

    const genreQuery = getGenreQuery(genreId);
    if (!genreQuery) {
      return res.status(404).json({ error: "Genre not found" });
    }

    const cacheKey = `genre|${genreId}|${page}|${limit}`;
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return res.json(cached.data);
      }
      cache.delete(cacheKey);
    }

    const data = await searchVolumes(genreQuery, {
      startIndex,
      maxResults: limit,
    });
    const items = (data.items || []).map(mapToToReadBook);
    const total =
      typeof data.totalItems === "number" ? data.totalItems : items.length;
    const totalPages = Math.min(Math.ceil(total / limit), 50);

    const responseData = {
      genre: genreId,
      page,
      limit,
      total,
      totalPages,
      items,
    };

    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });
    return res.json(responseData);
  } catch (err) {
    console.error("Genre error:", err.message);
    return res.status(500).json({ error: "Failed to fetch genre books" });
  }
}

// Get single book by ID
async function getBookById(req, res) {
  try {
    const { googleBookId } = req.params;
    
    if (!googleBookId) {
      return res.status(400).json({ error: 'Book ID is required' });
    }

    const cacheKey = `book|${googleBookId}`;
    
    // Check cache first
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`Cache hit for book: ${googleBookId}`);
        return res.json(cached.data);
      } else {
        cache.delete(cacheKey);
      }
    }

    console.log(`Fetching book details for: ${googleBookId}`);
    
    // Use existing getVolume function
    const volumeData = await getVolume(googleBookId);
    const book = mapToToReadBook(volumeData);
    
    const responseData = {
      book,
      volumeInfo: volumeData.volumeInfo,
      googleBookId
    };

    // Cache the result
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });
    
    return res.json(responseData);
  } catch (err) {
    console.error('Get book by ID error:', err?.message);
    if (err.response?.status === 404 || err.status === 404) {
      return res.status(404).json({ error: 'Book not found' });
    }
    return res.status(500).json({ error: 'Failed to fetch book details' });
  }
}

module.exports = { searchBooks, getTrendingBooks, getBooksByGenre, getBookById };