# Testing Plan - BookHive Core Features Unit Tests
**Project:** BookHive  
**Developer:** Aevin  
**Date:** November 2025  
**Sprint:** Sprint 3

---

## Overview

This testing plan outlines the unit testing strategy for BookHive's core book management features. The testing suite consists of **3 test files** with **3 total unit tests** (1 test per file) that validate critical API endpoints for review creation, collection management, and to-read list operations.

**Testing Framework:** Mocha + Supertest  
**Backend Technology:** Node.js, Express.js, MongoDB, Mongoose  
**Authentication:** JWT (JSON Web Tokens)

---

## Test Suite 1: Review Controller
**File:** `backend/TESTS/reviewController.test.js`  
**Status:** ✅ To Be Implemented  
**Developer:** Aevin

### Purpose
Validate the review creation functionality, ensuring authenticated users can submit reviews for books in their collection with proper validation and notification generation.

### Features/Code Being Tested

#### **API Endpoint:** `POST /api/reviews`
**Method/Controller:** `reviewsController.createReview()`  
**Service:** `ReviewService.createReview()`

**What is tested:**
- Creates a new review for a book in user's collection
- Validates all required fields (userId, googleBookId, rating, authorName)
- Validates rating is between 1-5
- Ensures book exists in user's collection before allowing review
- Prevents duplicate reviews for same book
- Generates notification after successful review creation

**Fields validated:**
- `userId` (String, required)
- `googleBookId` (String, required)
- `rating` (Number, required, 1-5)
- `comment` (String, optional, max 500 chars)
- `authorName` (String, required)
- `reviewedAt` (Date, auto-generated)

**Return object structure:**
```javascript
{
  _id: ObjectId,
  userId: String,
  googleBookId: String,
  rating: Number,
  comment: String,
  authorName: String,
  reviewedAt: Date
}
```

**Business Rules Tested:**
1. ✅ All required fields must be present
2. ✅ Rating must be between 1 and 5
3. ✅ Book must be in user's collection
4. ✅ User cannot review same book twice
5. ✅ Notification created on success

**Test validation:**
- Response status code: 201
- Review saved to database with all fields
- Notification generated for user
- Book must exist in user's collection
- Duplicate review attempt returns 400

**Error Cases:**
- 400: Missing required fields
- 400: Invalid rating (< 1 or > 5)
- 400: Book not in collection
- 400: Duplicate review attempt
- 500: Server error

---

## Test Suite 2: Collections Controller
**File:** `backend/TESTS/collectionsController.test.js`  
**Status:** ✅ To Be Implemented  
**Developer:** Aevin

### Purpose
Validate the book collection functionality, ensuring authenticated users can add books to their collection with proper status tracking.

### Features/Code Being Tested

#### **API Endpoint:** `POST /api/collections/books`
**Method/Controller:** `collectionsController.addBookToCollection()`  
**Service:** `CollectionService.addBookToCollection()`

**What is tested:**
- Adds a book to user's collection
- Validates required fields (userId, googleBookId, status)
- Sets initial status (currently-reading, re-reading, or completed)
- Creates or updates user's collection document
- Prevents duplicate book additions

**Fields validated:**
- `userId` (ObjectId reference, required)
- `googleBookId` (String, required)
- `status` (String enum, required: 'currently-reading', 're-reading', 'completed')
- `addedAt` (Date, auto-generated)
- `title` (String, optional - for display)

**Return object structure:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  books: [
    {
      googleBookId: String,
      status: String,
      title: String,
      addedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Business Rules Tested:**
1. ✅ Required fields present
2. ✅ Valid status value
3. ✅ Book added to collection array
4. ✅ Duplicate prevention

**Test validation:**
- Response status code: 201
- Collection document created/updated
- Book appears in books array
- Status properly set
- addedAt timestamp present

**Error Cases:**
- 400: Missing required fields
- 400: Invalid status value
- 400: Book already in collection
- 500: Server error

---

## Test Suite 3: To-Read Controller
**File:** `backend/TESTS/toReadController.test.js`  
**Status:** ✅ To Be Implemented  
**Developer:** Aevin

### Purpose
Validate the to-read list functionality, ensuring authenticated users can add books to their to-read list with proper tracking and notification generation.

### Features/Code Being Tested

#### **API Endpoint:** `POST /api/to-read`
**Method/Controller:** `toReadController.addBookToToRead()`  
**Service:** `ToReadService.addBookToToRead()`

**What is tested:**
- Adds a book to user's to-read list
- Creates notification for the action
- Validates required fields
- Prevents duplicate additions
- Uses domain events for notification

**Fields validated:**
- `userId` (ObjectId reference, required)
- `googleBookId` (String, required)
- `addedAt` (Date, auto-generated)

**Return object structure:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  books: [
    {
      googleBookId: String,
      addedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Business Rules Tested:**
1. ✅ Required fields present
2. ✅ Book added to to-read list
3. ✅ Notification created via domain events
4. ✅ Duplicate prevention

**Test validation:**
- Response status code: 201
- ToRead document created/updated
- Book appears in books array
- addedAt timestamp present
- Notification generated

**Error Cases:**
- 400: Missing required fields
- 400: Book already in to-read list
- 500: Server error

---

## Testing Environment Setup

### Prerequisites
```bash
# Install testing dependencies (if not already installed)
npm install --save-dev mocha supertest

# Ensure environment variables are set
MONGO_URI=<your_mongodb_connection_string>
MONGO_DB_NAME=Bookhive
JWT_SECRET=<your_jwt_secret>
```

### Test Execution Commands
```bash
# Run all Aevin's tests
npx mocha TESTS/reviewController.test.js TESTS/collectionsController.test.js TESTS/toReadController.test.js --timeout 10000 --exit

# Run specific test suite
npx mocha TESTS/reviewController.test.js --timeout 10000 --exit
npx mocha TESTS/collectionsController.test.js --timeout 10000 --exit
npx mocha TESTS/toReadController.test.js --timeout 10000 --exit

# Generate HTML report (for documentation)
npx mocha TESTS/reviewController.test.js TESTS/collectionsController.test.js TESTS/toReadController.test.js --reporter mochawesome --reporter-options reportDir=TESTS/aevin-report,reportFilename=aevin-report --timeout 10000
```

## Technical Notes

### Authentication Flow
All tests require JWT authentication:
1. Create test user with hashed password (bcrypt)
2. Generate valid JWT token using `JWT_SECRET`
3. Include token in request headers: `Authorization: Bearer <token>`
4. Middleware validates token and attaches `req.user.id`

### Database Cleanup
Each test suite includes:
- `before()` hook: Creates test data and database connection
- `after()` hook: Cleans up test data and closes connection
- Ensures tests are isolated and repeatable

### Assertion Style
Tests use explicit error throwing for clarity (matching team style):
```javascript
if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
if (!res.body._id) throw new Error("Response missing _id field");
```

---

## Repository Location
- **Testing Plan:** `backend/TESTS/TESTING_PLAN.md` (this documen)
- **Test Files:** `backend/TESTS/`
- **Test Results:** `backend/TESTS/TEST_RESULTS.md` (to be created)

---

## References
- Mocha Documentation: https://mochajs.org/
- Supertest Documentation: https://github.com/ladjs/supertest
- Mongoose Testing: https://mongoosejs.com/docs/jest.html
- JWT Authentication: https://jwt.io/
- Mochawesome Reporter: https://github.com/adamgruber/mochawesome