// backend/TESTS/nytBestsellers.test.js
const nock = require("nock");
const { getBestsellerList } = require("../services/nytBestsellers");

describe("NYT Bestsellers Service", function () {
  this.timeout(10000);

  const NYT_BASE_URL = "https://api.nytimes.com";
  const listName = "combined-print-and-e-book-fiction";

  afterEach(() => {
    // Clean up all HTTP mocks after each test
    nock.cleanAll();
  });

  it("successfully fetches and maps NYT bestseller data", async function () {
    // Mock NYT API response with sample data
    const mockNYTResponse = {
      status: "OK",
      results: {
        list_name: "Combined Print and E-Book Fiction",
        books: [
          {
            rank: 1,
            title: "THE WOMAN IN ME",
            author: "Britney Spears",
            description: "The pop star shares her story.",
            book_image: "https://example.com/image1.jpg",
            primary_isbn13: "9781668009048",
            weeks_on_list: 5,
            publisher: "Gallery Books",
          },
          {
            rank: 2,
            title: "HOLLY",
            author: "Stephen King",
            description: "The private detective takes on a case.",
            book_image: "https://example.com/image2.jpg",
            primary_isbn13: "9781668016138",
            weeks_on_list: 3,
            publisher: "Scribner",
          },
        ],
      },
    };

    // Setup nock to intercept the API call
    nock(NYT_BASE_URL)
      .get(/\/svc\/books\/v3\/lists\/current\/.*/)
      .query(true) // Accept any query parameters
      .reply(200, mockNYTResponse);

    // Call the function
    const result = await getBestsellerList(listName);

    // Validate the result
    if (!Array.isArray(result)) {
      throw new Error("Result should be an array");
    }
    if (result.length !== 2) {
      throw new Error(`Expected 2 books, got ${result.length}`);
    }

    // Validate first book mapping
    const firstBook = result[0];
    if (firstBook.title !== "THE WOMAN IN ME") {
      throw new Error("First book title mismatch");
    }
    if (
      !Array.isArray(firstBook.authors) ||
      firstBook.authors[0] !== "Britney Spears"
    ) {
      throw new Error("First book author mismatch");
    }
    if (firstBook.description !== "The pop star shares her story.") {
      throw new Error("First book description mismatch");
    }
    if (firstBook.thumbnail !== "https://example.com/image1.jpg") {
      throw new Error("First book thumbnail mismatch");
    }
    if (firstBook.isbn !== "9781668009048") {
      throw new Error("First book ISBN mismatch");
    }
    if (firstBook.rank !== 1) {
      throw new Error("First book rank mismatch");
    }
    if (firstBook.weeksOnList !== 5) {
      throw new Error("First book weeksOnList mismatch");
    }
    if (firstBook.publisher !== "Gallery Books") {
      throw new Error("First book publisher mismatch");
    }

    // Validate second book basics
    const secondBook = result[1];
    if (secondBook.title !== "HOLLY") {
      throw new Error("Second book title mismatch");
    }
    if (secondBook.authors[0] !== "Stephen King") {
      throw new Error("Second book author mismatch");
    }
    if (secondBook.rank !== 2) {
      throw new Error("Second book rank mismatch");
    }
  });

  it("returns empty array when NYT API returns no books", async function () {
    // Mock NYT API response with empty books array
    const mockEmptyResponse = {
      status: "OK",
      results: {
        list_name: "Combined Print and E-Book Fiction",
        books: [],
      },
    };

    nock(NYT_BASE_URL)
      .get(/\/svc\/books\/v3\/lists\/current\/.*/)
      .query(true)
      .reply(200, mockEmptyResponse);

    const result = await getBestsellerList(listName);

    if (!Array.isArray(result)) {
      throw new Error("Result should be an array");
    }
    if (result.length !== 0) {
      throw new Error(`Expected empty array, got ${result.length} items`);
    }
  });

  it("handles NYT API errors gracefully", async function () {
    // Mock NYT API to return 500 error
    nock(NYT_BASE_URL)
      .get(/\/svc\/books\/v3\/lists\/current\/.*/)
      .query(true)
      .reply(500, { error: "Internal Server Error" });

    try {
      await getBestsellerList(listName);
      // If we reach here, the test should fail
      throw new Error("Expected function to throw an error, but it didn't");
    } catch (error) {
      // Verify that an error was thrown
      if (
        !error.message.includes("NYT API error") &&
        !error.message.includes("500") &&
        !error.message.includes("fetch")
      ) {
        throw new Error(`Expected NYT API error, got: ${error.message}`);
      }
      // Test passed - error was thrown as expected
    }
  });

  it("handles malformed API responses", async function () {
    // Mock NYT API response with missing results.books
    const mockMalformedResponse = {
      status: "OK",
      results: {
        list_name: "Combined Print and E-Book Fiction",
        // books array is missing
      },
    };

    nock(NYT_BASE_URL)
      .get(/\/svc\/books\/v3\/lists\/current\/.*/)
      .query(true)
      .reply(200, mockMalformedResponse);

    const result = await getBestsellerList(listName);

    // Should return empty array for malformed response
    if (!Array.isArray(result)) {
      throw new Error("Result should be an array");
    }
    if (result.length !== 0) {
      throw new Error(
        `Expected empty array for malformed response, got ${result.length} items`
      );
    }
  });

  it("correctly maps all book fields from NYT format to internal format", async function () {
    // Mock with comprehensive book data
    const mockResponse = {
      status: "OK",
      results: {
        books: [
          {
            rank: 5,
            title: "TEST BOOK",
            author: "Test Author Name",
            description: "A comprehensive test description.",
            book_image: "https://test.com/cover.jpg",
            primary_isbn13: "9781234567890",
            weeks_on_list: 10,
            publisher: "Test Publisher Inc",
          },
        ],
      },
    };

    nock(NYT_BASE_URL)
      .get(/\/svc\/books\/v3\/lists\/current\/.*/)
      .query(true)
      .reply(200, mockResponse);

    const result = await getBestsellerList(listName);

    if (result.length !== 1) {
      throw new Error(`Expected 1 book, got ${result.length}`);
    }

    const book = result[0];

    // Verify all fields are correctly mapped
    const requiredFields = [
      "title",
      "authors",
      "description",
      "thumbnail",
      "isbn",
      "rank",
      "weeksOnList",
      "publisher",
    ];

    for (const field of requiredFields) {
      if (!(field in book)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Verify authors is an array (even for single author)
    if (!Array.isArray(book.authors)) {
      throw new Error("Authors field should be an array");
    }
    if (book.authors.length !== 1) {
      throw new Error(`Expected 1 author, got ${book.authors.length}`);
    }
  });
});
