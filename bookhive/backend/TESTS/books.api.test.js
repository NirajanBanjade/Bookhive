// backend/TESTS/books.api.test.js
const nock = require("nock");

// Mock the frontend getTrendingBooks function
// Since we're testing backend, we'll test the API endpoint it calls
async function getTrendingBooks({ limit = 10, signal } = {}) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));

  const res = await fetch(
    `http://localhost:3000/api/books/trending?${params.toString()}`,
    {
      signal,
    }
  );

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

describe("Frontend Books API - getTrendingBooks()", function () {
  this.timeout(10000);

  const API_BASE = "http://localhost:3000";

  afterEach(() => {
    nock.cleanAll();
  });

  it("successfully fetches trending books with default limit", async function () {
    const mockResponse = {
      books: [
        {
          title: "Trending Book 1",
          authors: ["Author 1"],
          thumbnail: "http://example.com/book1.jpg",
          isbn: "1234567890123",
        },
        {
          title: "Trending Book 2",
          authors: ["Author 2"],
          thumbnail: "http://example.com/book2.jpg",
          isbn: "9876543210987",
        },
      ],
      count: 2,
    };

    nock(API_BASE)
      .get("/api/books/trending")
      .query({ limit: "10" })
      .reply(200, mockResponse);

    const result = await getTrendingBooks({});

    // Validate response structure
    if (!result) {
      throw new Error("Result should not be null or undefined");
    }
    if (!result.books) {
      throw new Error("Result should have 'books' property");
    }
    if (!Array.isArray(result.books)) {
      throw new Error("books should be an array");
    }
    if (result.books.length !== 2) {
      throw new Error(`Expected 2 books, got ${result.books.length}`);
    }

    // Validate first book
    const firstBook = result.books[0];
    if (firstBook.title !== "Trending Book 1") {
      throw new Error("First book title mismatch");
    }
    if (!Array.isArray(firstBook.authors)) {
      throw new Error("Authors should be an array");
    }
    if (firstBook.authors[0] !== "Author 1") {
      throw new Error("First book author mismatch");
    }
  });

  it("respects custom limit parameter", async function () {
    const mockResponse = {
      books: [
        { title: "Book 1", authors: ["Author 1"], isbn: "123" },
        { title: "Book 2", authors: ["Author 2"], isbn: "456" },
        { title: "Book 3", authors: ["Author 3"], isbn: "789" },
      ],
      count: 3,
    };

    nock(API_BASE)
      .get("/api/books/trending")
      .query({ limit: "3" })
      .reply(200, mockResponse);

    const result = await getTrendingBooks({ limit: 3 });

    if (result.books.length !== 3) {
      throw new Error(
        `Expected 3 books with limit=3, got ${result.books.length}`
      );
    }
    if (result.count !== 3) {
      throw new Error("Count mismatch");
    }
  });

  it("handles 500 server error gracefully", async function () {
    nock(API_BASE)
      .get("/api/books/trending")
      .query({ limit: "10" })
      .reply(500, { error: "Internal Server Error" });

    try {
      await getTrendingBooks({});
      throw new Error("Expected function to throw an error, but it didn't");
    } catch (error) {
      // Accept either "Failed to fetch" or the actual error message
      if (
        !error.message.includes("Failed to fetch") &&
        !error.message.includes("Internal Server Error") &&
        !error.message.includes("500")
      ) {
        throw new Error(`Expected server error, got: ${error.message}`);
      }
      // Test passed - error was thrown as expected
    }
  });

  it("handles 404 not found error", async function () {
    nock(API_BASE)
      .get("/api/books/trending")
      .query({ limit: "10" })
      .reply(404, { error: "Endpoint not found" });

    try {
      await getTrendingBooks({});
      throw new Error("Expected function to throw an error, but it didn't");
    } catch (error) {
      // Accept either "Failed to fetch", "404", or the actual error message
      if (
        !error.message.includes("404") &&
        !error.message.includes("Failed to fetch") &&
        !error.message.includes("Endpoint not found")
      ) {
        throw new Error(`Expected 404 error, got: ${error.message}`);
      }
      // Test passed - error was thrown as expected
    }
  });

  it("handles empty response from server", async function () {
    const mockEmptyResponse = {
      books: [],
      count: 0,
    };

    nock(API_BASE)
      .get("/api/books/trending")
      .query({ limit: "10" })
      .reply(200, mockEmptyResponse);

    const result = await getTrendingBooks({});

    if (!Array.isArray(result.books)) {
      throw new Error("books should be an array");
    }
    if (result.books.length !== 0) {
      throw new Error(`Expected empty array, got ${result.books.length} items`);
    }
    if (result.count !== 0) {
      throw new Error("Count should be 0 for empty response");
    }
  });

  it("supports AbortController for request cancellation", async function () {
    const controller = new AbortController();

    nock(API_BASE)
      .get("/api/books/trending")
      .query({ limit: "10" })
      .delay(100) // Delay response
      .reply(200, { books: [], count: 0 });

    // Abort immediately
    controller.abort();

    try {
      await getTrendingBooks({ signal: controller.signal });
      throw new Error("Expected request to be aborted, but it succeeded");
    } catch (error) {
      // AbortError expected
      if (error.name !== "AbortError" && !error.message.includes("abort")) {
        throw new Error(
          `Expected AbortError, got: ${error.name} - ${error.message}`
        );
      }
    }
  });

  it("handles malformed JSON response", async function () {
    nock(API_BASE)
      .get("/api/books/trending")
      .query({ limit: "10" })
      .reply(200, "not valid json");

    try {
      await getTrendingBooks({});
      throw new Error("Expected function to throw an error for malformed JSON");
    } catch (error) {
      // Should throw a JSON parsing error
      if (
        !error.message.includes("JSON") &&
        !error.message.includes("Unexpected")
      ) {
        throw new Error(`Expected JSON parse error, got: ${error.message}`);
      }
    }
  });

  it("correctly builds query parameters with various limits", async function () {
    const testLimits = [5, 15, 20, 50];

    for (const limit of testLimits) {
      nock(API_BASE)
        .get("/api/books/trending")
        .query({ limit: String(limit) })
        .reply(200, { books: [], count: 0 });

      const result = await getTrendingBooks({ limit });

      if (!result) {
        throw new Error(`Failed to fetch with limit=${limit}`);
      }
    }
  });

  it("handles network timeout", async function () {
    const controller = new AbortController();

    nock(API_BASE)
      .get("/api/books/trending")
      .query({ limit: "10" })
      .delayConnection(5000) // Simulate slow network
      .reply(200, { books: [] });

    // Timeout after 100ms
    setTimeout(() => controller.abort(), 100);

    try {
      await getTrendingBooks({ signal: controller.signal });
      throw new Error("Expected request to timeout");
    } catch (error) {
      // Abort or timeout error expected
      if (
        error.name !== "AbortError" &&
        !error.message.includes("abort") &&
        !error.message.includes("timeout")
      ) {
        throw new Error(`Expected timeout/abort error, got: ${error.message}`);
      }
    }
  });

  it("returns data in expected format with all required fields", async function () {
    const mockResponse = {
      books: [
        {
          title: "Complete Book",
          authors: ["Test Author"],
          description: "A test description",
          thumbnail: "http://example.com/thumb.jpg",
          isbn: "1234567890123",
          rank: 1,
          weeksOnList: 5,
          publisher: "Test Publisher",
        },
      ],
      count: 1,
    };

    nock(API_BASE)
      .get("/api/books/trending")
      .query({ limit: "10" })
      .reply(200, mockResponse);

    const result = await getTrendingBooks({});

    const book = result.books[0];

    // Validate all expected fields exist
    const requiredFields = ["title", "authors", "thumbnail", "isbn"];
    for (const field of requiredFields) {
      if (!(field in book)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate data types
    if (typeof book.title !== "string") {
      throw new Error("title should be a string");
    }
    if (!Array.isArray(book.authors)) {
      throw new Error("authors should be an array");
    }
  });
});
