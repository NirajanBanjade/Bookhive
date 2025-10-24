// controllers/bookController.js
const { searchVolumes, mapToToReadBook } = require('../services/googleBooks');
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

function makeCacheKey({ qRaw, searchType, keywords, page, limit }) { // include keywords in cache key
  return `${searchType}|${qRaw}|${keywords}|${page}|${limit}`;
}

async function searchBooks(req, res) {
  try {
    // Normalize inputs: accept q OR title OR keywords for the main query
    const { searchType = 'title' } = req.query;                           
    const qRaw = (req.query.q || req.query.title || req.query.keywords || '').trim(); 
    const keywords = (req.query.keywords || '').trim();                   // keep keywords for filtering

    if (!qRaw) {
      return res.status(400).json({ error: 'Please input a search' });
    }

    const page = clamp(parseInt(req.query.page || '1', 10) || 1, 1, 1_000_000);
    const limit = clamp(parseInt(req.query.limit || '20', 10) || 20, 1, 40); // Google max 40
    const startIndex = (page - 1) * limit;

    // Construct final query based on searchType
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

    // Check cache before making API call
    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {  //check if cache is still valid (less than 5 minutes old)
        console.log(`Cache hit for: ${cacheKey}`);
        return res.json(cached.data);
      } else {
        cache.delete(cacheKey); // expired
      }
    }

    console.log(`Cache miss. Searching Google Books for: "${finalQ}", keywords: "${keywords}", page: ${page}, limit: ${limit}`);

    // Call Google Books API after cache miss
    const data = await searchVolumes(finalQ, { startIndex, maxResults: limit });

    // Raw items from Google API to get description for keyword filtering
    let rawItems = data.items || [];

    // If keywords provided, filter results by checking if all keywords are in the description
    if (keywords) {
      const kws = keywords.split(',').map(kw => kw.trim().toLowerCase()).filter(Boolean);
      rawItems = rawItems.filter(volume => {
        const desc = (volume.volumeInfo?.description || '').toLowerCase();
        return kws.every(kw => desc.includes(kw));
      });
    }

    // Map to the ToReadBook schema
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
      finalQ,                   // for debugging
      page,
      limit,
      total,
      totalPages,
      hasMore,
      nextPage,
      prevPage,
      items
    };

    // Save to cache
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });

    return res.json(responseData);
  } catch (err) {
    console.error('Books search error:', err?.response?.data || err.message);
    return res.status(500).json({ error: 'server error' });
  }
}

// Trending Books with NYT section
async function getTrendingBooks(req, res) {
  try {
    const limit = Math.max(1, Math.min(50, parseInt(req.query.limit || '10', 10)));
    const cacheKey = `trending_nyt_${limit}`;

    if (cache.has(cacheKey)) {
      const cached = cache.get(cacheKey);
      const TRENDING_CACHE_TTL = 1000 * 60 * 60 * 6; // 6 hours
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

module.exports = { searchBooks, getTrendingBooks, getBooksByGenre };
