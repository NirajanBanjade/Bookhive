# Testing Plan - Trending and Genre System Unit Tests
**Project:** BookHive  
**Developer:** Prashant Panta  
**Date:** November 25, 2025  
**Sprint:** Sprint 3

---

## Overview

This testing plan outlines the unit testing strategy for BookHive's trending books and genre system features. The testing suite consists of **3 test files** covering NYT Bestsellers API integration, genre mapping functionality, and frontend books API calls.

**Testing Framework:** Mocha with Nock for HTTP mocking  
**Backend Technology:** Node.js, Express.js  
**Frontend Technology:** React with Fetch API

---

## Test Suite 1: NYT Bestsellers Service
**File:** `backend/TESTS/nytBestsellers.test.js`  
**Status:** Done  
**Developer:** Prashant Panta

### Purpose
Validate the NYT Bestsellers API integration service, ensuring proper data fetching, mapping, and error handling for trending books functionality.

### Features/Code Being Tested

#### **Service:** `getBestsellerList(listName)`
**File:** `backend/services/nytBestsellers.js`  
**External API:** NYT Books API v3

**Test Cases (5 tests):**
1. Successfully fetches and maps NYT bestseller data
2. Returns empty array when NYT API returns no books
3. Handles NYT API errors gracefully
4. Handles malformed API responses
5. Correctly maps all book fields from NYT format to internal format

---

## Test Suite 2: Genre Mapping Functions
**File:** `backend/TESTS/genreMapping.test.js`  
**Status:** Done  
**Developer:** Prashant Panta

### Purpose
Validate genre mapping and conversion functions used throughout the application for genre-based book browsing.

### Features/Code Being Tested

#### **Functions:** Genre mapping utilities
**File:** `backend/constants/genreMapping.js`

**Test Cases (10 tests):**
1. Returns correct query string for all 12 primary genres
2. Returns null for invalid genre
3. Resolves common sci-fi aliases to 'scifi'
4. Resolves all defined aliases correctly
5. Handles case-insensitive alias resolution
6. Returns normalized input when no alias exists
7. Handles empty and whitespace inputs
8. Contains exactly 12 genres
9. All query strings start with 'subject:'
10. Has unique query values for each genre

---

## Test Suite 3: Frontend Books API
**File:** `backend/TESTS/books.api.test.js`  
**Status:** Done  
**Developer:** Prashant Panta

### Purpose
Validate frontend API client for trending books functionality, including proper error handling and AbortController usage.

### Features/Code Being Tested

#### **API Function:** `getTrendingBooks()`
**File:** `frontend/src/api/books.js`

**What is tested:**
- Successful API call and response parsing
- Custom limit parameter handling
- Error handling for failed requests (500, 404)
- AbortController integration for request cancellation
- Response data structure validation
- Malformed JSON handling
- Query parameter building
- Network timeout handling
- Required fields validation

**Function signature:**
```javascript
async function getTrendingBooks({ limit = 10, signal } = {})
```

**Input parameters:**
- `limit` (Number, optional) - Number of books to fetch (default: 10)
- `signal` (AbortSignal, optional) - AbortController signal for cancellation

**Return object structure:**
```javascript
{
  books: [
    {
      title: String,
      authors: Array<String>,
      description: String,
      thumbnail: String,
      isbn: String,
      rank: Number,
      weeksOnList: Number,
      publisher: String
    }
  ],
  count: Number
}
```

**Test Cases (10 tests):**
1. Successfully fetches trending books with default limit
2. Respects custom limit parameter
3. Handles 500 server error gracefully
4. Handles 404 not found error
5. Handles empty response from server
6. Supports AbortController for request cancellation
7. Handles malformed JSON response
8. Correctly builds query parameters with various limits
9. Handles network timeout
10. Returns data in expected format with all required fields

**Business Rules Tested:**
1. Default limit is 10 books
2. Custom limits are respected
3. API errors throw descriptive error messages
4. Empty responses return empty arrays (not null)
5. Requests can be cancelled via AbortController
6. Malformed responses throw parsing errors
7. All required book fields are present in response
8. Query parameters are correctly formatted

**Test Validation:**
- HTTP mocking using `nock` library
- No actual external API calls during tests
- Response structure validation
- Error handling validation
- AbortController functionality
- Query parameter formatting

**External Dependencies Mocked:**
- Backend API endpoint `/api/books/trending`
- Uses `nock` to intercept HTTP requests

**Error Cases:**
- 500: Server error
- 404: Endpoint not found
- Network timeout
- Malformed JSON response
- Aborted requests

---

## Testing Environment Setup

### Prerequisites
```bash
# Install testing dependencies
npm install --save-dev mocha nock
```

### Test Execution Commands

#### Run Individual Tests
```bash
# Test 1: NYT Bestsellers
npx mocha backend/TESTS/nytBestsellers.test.js --timeout 10000 --exit

# Test 2: Genre Mapping
npx mocha backend/TESTS/genreMapping.test.js --timeout 10000 --exit

# Test 3: Books API
npx mocha backend/TESTS/books.api.test.js --timeout 10000 --exit
```

#### Run All Tests Together
```bash
npx mocha backend/TESTS/nytBestsellers.test.js backend/TESTS/genreMapping.test.js backend/TESTS/books.api.test.js --timeout 10000 --exit
```

#### Generate HTML Reports
```bash
# Individual reports
npx mocha backend/TESTS/nytBestsellers.test.js --reporter mochawesome --reporter-options reportDir=backend/TESTS/prashant-report,reportFilename=nyt-bestsellers-report --timeout 10000 --exit

npx mocha backend/TESTS/genreMapping.test.js --reporter mochawesome --reporter-options reportDir=backend/TESTS/prashant-report,reportFilename=genre-mapping-report --timeout 10000 --exit

npx mocha backend/TESTS/books.api.test.js --reporter mochawesome --reporter-options reportDir=backend/TESTS/prashant-report,reportFilename=books-api-report --timeout 10000 --exit

# Combined report
npx mocha backend/TESTS/nytBestsellers.test.js backend/TESTS/genreMapping.test.js backend/TESTS/books.api.test.js --reporter mochawesome --reporter-options reportDir=backend/TESTS/prashant-report,reportFilename=complete-report --timeout 10000 --exit
```

---

## Technical Notes

### HTTP Mocking Strategy
- Use `nock` library to intercept HTTP requests
- Mock responses for various scenarios (success, error, malformed, timeout)
- Clean up mocks after each test using `afterEach()`
- No actual external API calls during test execution

### Assertion Style
Following team convention with explicit error throwing:
```javascript
if (result.length !== 2) {
  throw new Error(`Expected 2 books, got ${result.length}`);
}
```

### Test Isolation
- Each test is independent
- Mocks are cleaned up after each test
- No shared state between tests
- Tests can run in any order

---

## Coverage Goals

**Target Coverage:** >80% for tested modules

**Modules:**
1. `services/nytBestsellers.js` - 100% coverage
2. `constants/genreMapping.js` - 100% coverage
3. `api/books.js` - >80% coverage for getTrendingBooks()

---

## Repository Location
- **Testing Plan:** `backend/TESTS/TESTING_PLAN_PRASHANT.md` (this document)
- **Test Files:** 
  - `backend/TESTS/nytBestsellers.test.js`
  - `backend/TESTS/genreMapping.test.js`
  - `backend/TESTS/books.api.test.js`
- **Test Results:** `backend/TESTS/TEST_RESULTS_PRASHANT.md`
- **Reports:** `backend/TESTS/prashant-report/`

---

## Test Execution Summary

| Test Suite | File | Tests | Status |
|------------|------|-------|--------|
| NYT Bestsellers Service | nytBestsellers.test.js | 5 | Done |
| Genre Mapping Functions | genreMapping.test.js | 10 | Done |
| Frontend Books API | books.api.test.js | 10 | Done |
| **TOTAL** | **3 files** | **25** | **ALL DONE** |

---

## References
- Mocha Documentation: https://mochajs.org/
- Nock HTTP Mocking: https://github.com/nock/nock
- NYT Books API: https://developer.nytimes.com/docs/books-product/1/overview
- Mochawesome Reporter: https://github.com/adamgruber/mochawesome