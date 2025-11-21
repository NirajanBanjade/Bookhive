# Testing Plan - Notification System Unit Tests
**Project:** BookHive  
**Developer:** Prajwal Kunwar  
**Task:** KAN-93  
**Date:** November 2025  
**Sprint:** Sprint 3

---

## Overview

This testing plan outlines the comprehensive unit testing strategy for the BookHive notification system and related features. The testing suite consists of **3 test files** with **9 total unit tests** (3 tests per file) that validate critical API endpoints, methods, and data structures across the notification, book operations, and review systems.

**Testing Framework:** Mocha + Supertest  
**Backend Technology:** Node.js, Express.js, MongoDB, Mongoose  
**Authentication:** JWT (JSON Web Tokens)

---

## Test Suite 1: Notification API Routes
**File:** `backend/TESTS/notification.routes.test.js`  
**Status:**  Implemented and Passing  
**Developer:** Prajwal Kunwar

### Purpose
Validate the core CRUD (Create, Read, Update) operations of the notification system, ensuring authenticated users can retrieve, read, and manage their notifications through REST API endpoints.

### Features/Code Being Tested

#### 1. **API Endpoint:** `GET /api/notifications`
**Method/Controller:** `notificationController.getNotifications()`

**What is tested:**
- Retrieves all notifications for authenticated user
- Validates JWT authentication middleware
- Confirms proper response structure with `items` array
- Verifies notifications are user-specific (userId filtering)

**Fields validated:**
- `userId` (ObjectId reference to User)
- `message` (String)
- `type` (String enum: 'info', 'success', 'warning', 'error')
- `read` (Boolean)
- `createdAt` (Date)

**Return object structure:**
```javascript
{
  items: [
    {
      _id: ObjectId,
      userId: ObjectId,
      message: String,
      type: String,
      read: Boolean,
      createdAt: Date
    }
  ]
}
```

**Test validation:**
- Response status code: 200
- Response body contains `items` array
- All items belong to authenticated user

---

#### 2. **API Endpoint:** `PATCH /api/notifications/:id/read`
**Method/Controller:** `notificationController.markAsRead()`

**What is tested:**
- Marks a single notification as read
- Validates notification ID parameter
- Ensures user can only mark their own notifications
- Updates `read` field to `true` in database

**Fields validated:**
- `_id` (notification ID from URL params)
- `read` (Boolean - updated from false to true)
- `userId` (ensures ownership before update)

**Return object structure:**
```javascript
{
  message: "Notification marked as read",
  notification: {
    _id: ObjectId,
    read: true,
    // ... other fields
  }
}
```

**Test validation:**
- Response status code: 200
- Database record updated (`read: true`)
- Only target notification affected

---

#### 3. **API Endpoint:** `PATCH /api/notifications/read-all`
**Method/Controller:** `notificationController.markAllAsRead()`

**What is tested:**
- Bulk update operation on all user notifications
- Validates mass update queries work correctly
- Ensures only authenticated user's notifications are affected

**Fields validated:**
- `userId` (filter criteria for bulk update)
- `read` (Boolean - all updated to true)

**Return object structure:**
```javascript
{
  message: "All notifications marked as read",
  modifiedCount: Number
}
```

**Test validation:**
- Response status code: 200
- All user notifications have `read: true`
- No unread notifications remain for user

---

### Dependencies
- MongoDB database connection
- JWT secret for token generation
- User model for authentication
- Notification model for data operations

### Test Execution Evidence
```
  Notification API (Full Integration)
    ✔ lists notifications for the authenticated user (85ms)
    ✔ marks a single notification as read (208ms)
    ✔ marks all notifications as read (145ms)
  3 passing (2s)
```
---

## Test Suite 2: Book Operations & Reading List
**File:** `backend/TESTS/book.operations.test.js`  
**Status:**  To Be Implemented  
**Developer:** Prajwal Kunwar

### Purpose
Validate book management operations including adding/removing books from user reading lists, updating book status, and ensuring notification triggers fire correctly when these operations occur.

### Features/Code Being Tested

#### 1. **API Endpoint:** `POST /api/books/:bookId/add-to-list`
**Method/Controller:** `bookController.addToReadingList()`

**What is tested:**
- Adds a book to user's reading list
- Creates a notification for the action
- Validates book existence before adding
- Prevents duplicate additions

**Fields validated:**
- `bookId` (ObjectId or Google Books ID)
- `userId` (authenticated user)
- `status` (String enum: 'To-Read', 'Currently Reading', 'Completed')
- Notification creation with proper message

**Return object structure:**
```javascript
{
  message: "Book added to reading list",
  book: {
    _id: ObjectId,
    userId: ObjectId,
    bookId: String,
    status: String,
    addedAt: Date
  },
  notification: {
    _id: ObjectId,
    message: "Book added to your reading list"
  }
}
```

**Test validation:**
- Response status code: 201
- Book appears in user's reading list
- Notification created and visible
- Proper status field set

---

#### 2. **API Endpoint:** `DELETE /api/books/:bookId/remove-from-list`
**Method/Controller:** `bookController.removeFromReadingList()`

**What is tested:**
- Removes book from user's reading list
- Validates book exists in list before removal
- Confirms database deletion
- Returns appropriate success message

**Fields validated:**
- `bookId` (identifies book to remove)
- `userId` (ensures user owns the reading list entry)
- Deletion confirmation

**Return object structure:**
```javascript
{
  message: "Book removed from reading list",
  deletedBookId: String
}
```

**Test validation:**
- Response status code: 200
- Book no longer in database for user
- Proper error handling if book not found

---

#### 3. **API Endpoint:** `PATCH /api/books/:bookId/update-status`
**Method/Controller:** `bookController.updateBookStatus()`

**What is tested:**
- Updates reading status of a book
- Validates status transitions (To-Read → Currently Reading → Completed)
- Ensures user can only update their own books
- Updates timestamp for status change

**Fields validated:**
- `bookId` (identifies book to update)
- `status` (new status value)
- `userId` (ownership validation)
- `updatedAt` (timestamp)

**Return object structure:**
```javascript
{
  message: "Book status updated",
  book: {
    _id: ObjectId,
    bookId: String,
    status: String, // Updated value
    updatedAt: Date
  }
}
```

**Test validation:**
- Response status code: 200
- Status field correctly updated in database
- Valid status enum value enforced
- Proper error for invalid status values

---

### Dependencies
- MongoDB database connection
- JWT authentication
- Book model (or Google Books API integration)
- User reading list schema/collection
- Notification model (for add operation)
```


## Test Suite 3: Review Operations & Validation
**File:** `backend/TESTS/review.operations.test.js`  
**Status:**  To Be Implemented  
**Developer:** Prajwal Kunwar

### Purpose
Validate review submission, duplicate prevention, update, and deletion operations. This testing is critical because the current system shows modal alerts for duplicate reviews but doesn't properly create notifications or validate all edge cases.

### Features/Code Being Tested

#### 1. **API Endpoint:** `POST /api/reviews/:bookId`
**Method/Controller:** `reviewController.submitReview()`

**What is tested:**
- Submits a new review for a book
- Creates notification on successful submission
- Validates required fields (rating, review text)
- Ensures user authentication

**Fields validated:**
- `bookId` (ObjectId or Google Books ID)
- `userId` (authenticated user)
- `rating` (Number, 1-5 stars)
- `reviewText` (String, minimum length validation)
- `createdAt` (Date timestamp)
- Notification generation

**Return object structure:**
```javascript
{
  message: "Review submitted successfully",
  review: {
    _id: ObjectId,
    bookId: String,
    userId: ObjectId,
    rating: Number,
    reviewText: String,
    createdAt: Date
  },
  notification: {
    _id: ObjectId,
    message: "Your review for [Book Title] has been submitted"
  }
}
```

**Test validation:**
- Response status code: 201
- Review saved to database
- Notification created and appears in notification center
- All required fields populated

---

#### 2. **API Endpoint:** `POST /api/reviews/:bookId` (Duplicate Prevention)
**Method/Controller:** `reviewController.submitReview()` - Duplicate validation logic

**What is tested:**
- Prevents user from submitting duplicate review
- Checks existing reviews before allowing new submission
- Returns appropriate error message
- Creates warning notification for duplicate attempt

**Fields validated:**
- Existing review query: `{ userId, bookId }`
- Duplicate detection logic
- Error response structure
- Warning notification generation

**Return object structure:**
```javascript
{
  error: "You have already reviewed this book",
  existingReview: {
    _id: ObjectId,
    rating: Number,
    reviewText: String,
    createdAt: Date
  },
  notification: {
    type: "warning",
    message: "You have already reviewed this book"
  }
}
```

**Test validation:**
- Response status code: 400 (Bad Request)
- Duplicate review not created in database
- Warning notification generated
- Existing review data returned

---

#### 3. **API Endpoint:** `DELETE /api/reviews/:reviewId`
**Method/Controller:** `reviewController.deleteReview()`

**What is tested:**
- Deletes user's review
- Validates review ownership before deletion
- Confirms database deletion
- Creates notification for successful deletion

**Fields validated:**
- `reviewId` (identifies review to delete)
- `userId` (ensures user owns the review)
- Deletion confirmation
- Notification generation

**Return object structure:**
```javascript
{
  message: "Review deleted successfully",
  deletedReviewId: ObjectId,
  notification: {
    message: "Your review has been deleted"
  }
}
```

**Test validation:**
- Response status code: 200
- Review removed from database
- User cannot delete another user's review (403 Forbidden)
- Notification created and visible

---

### Dependencies
- MongoDB database connection
- JWT authentication
- Review model/schema
- Book model (for book title in notifications)
- Notification model
- User model for authentication
```

---

## Testing Environment Setup

### Prerequisites
```bash
# Install testing dependencies
npm install --save-dev mocha supertest

# Ensure environment variables are set
MONGO_URI=<your_mongodb_connection_string>
MONGO_DB_NAME=Bookhive
JWT_SECRET=<your_jwt_secret>
```

### Test Execution Commands
```bash
# Run all tests
npm test

# Run specific test suite
npx mocha TESTS/notification.routes.test.js --timeout 10000 --exit
npx mocha TESTS/book.operations.test.js --timeout 10000 --exit
npx mocha TESTS/review.operations.test.js --timeout 10000 --exit

# Run tests with HTML reporter (for documentation)
npx mocha TESTS --reporter mochawesome --timeout 10000

# Run tests with JSON output
npx mocha TESTS --reporter json --timeout 10000 > test-results.json
```

### Expected Test Coverage

| Test Suite | Test Count | API Endpoints Covered | Status |
|------------|------------|-----------------------|--------|
| Notification Routes | 3 | 3 endpoints |  Passing |
| Book Operations | 3 | 3 endpoints |  Pending |
| Review Operations | 3 | 2 endpoints (3 scenarios) |  Pending |
| **TOTAL** | **9** | **8 endpoints** | **33% Complete** |

---

## Success Criteria

### For KAN-93 (Testing Plan) - CURRENT TASK
- [x] Document all 3 test suites
- [x] Identify features and code to be tested
- [x] Specify API endpoints and methods
- [x] Define fields and return objects
- [x] Commit to repository at `backend/TESTS/TESTING_PLAN.md`

### For KAN-94 (Test Execution & Results) - NEXT TASK
- [ ] Implement book.operations.test.js
- [ ] Implement review.operations.test.js
- [ ] All 9 tests passing
- [ ] Generate HTML/PDF test report
- [ ] Document results in TEST_RESULTS.md
- [ ] Commit test evidence to repository

---

## Technical Notes

### Authentication Flow
All tests require JWT authentication:
1. Create test user with hashed password
2. Generate valid JWT token using `JWT_SECRET`
3. Include token in request headers: `Authorization: Bearer <token>`
4. Middleware validates token and attaches `req.user.id`

### Database Cleanup
Each test suite includes:
- `before()` hook: Creates test data and database connection
- `after()` hook: Cleans up test data and closes connection
- Ensures tests are isolated and repeatable

### Assertion Style
Tests use explicit error throwing for clarity:
```javascript
if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
if (!Array.isArray(res.body.items)) throw new Error("Response missing items array");
```

---

## Repository Location
- **Testing Plan:** `backend/TESTS/TESTING_PLAN.md` (this document)
- **Test Files:** `backend/TESTS/`
- **Test Results:** `backend/TESTS/TEST_RESULTS.md` (to be created in KAN-94)

---

## References
- Mocha Documentation: https://mochajs.org/
- Supertest Documentation: https://github.com/ladjs/supertest
- Mongoose Testing: https://mongoosejs.com/docs/jest.html
- JWT Authentication: https://jwt.io/





