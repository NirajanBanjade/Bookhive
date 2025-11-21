# Test Execution & Results - Notification System Unit Tests

**Project:** BookHive  
**Task:** KAN-94 - Test Execution & Results  
**Author:** Prajwal Kunwar  
**Date:** November 20, 2025  

---

## Overview

This document provides comprehensive documentation of the unit test execution for the BookHive Notification System. All tests were executed using the Mocha testing framework with automated reporting via Mochawesome.

### Features Tested

1. **Notification API Routes** - User notification management endpoints
2. **Book Operations** - Reading list management (add, remove, move books)
3. **Review Operations** - Book review submission and retrieval

---

## Test Execution Summary

A total of **9 unit tests** were executed across 3 test suites, all of which **passed successfully**.

| Test Suite | Test File | Tests | Status |
|------------|-----------|-------|--------|
| Notification API | `notification.routes.test.js` | 3 | PASSED |
| Book Operations API | `book.operations.test.js` | 3 | PASSED |
| Review Operations API | `review.operations.test.js` | 3 | PASSED |
| **TOTAL** | **3 files** | **9** | **ALL PASSED** |

---

## Tools and Dependencies

The following testing tools and frameworks were used:

- **Mocha** (v11.7.4) - Testing framework
- **Supertest** (v7.1.4) - HTTP assertion library for API testing
- **Chai** (v6.2.1) - Assertion library
- **Mochawesome** (latest) - HTML/JSON test reporter
- **Cross-env** (v10.1.0) - Environment variable management
- **MongoDB** - Test database
- **Mongoose** (v8.18.2) - MongoDB ODM

---

## Test Execution Commands

### Run All Tests with HTML Report Generation
```bash
npm run report:notifications
```

### Run Tests Without Report (Quick Check)
```bash
npm run test:notifications-all
```

### Script Configuration (package.json)
```json
"scripts": {
  "test:notifications-all": "cross-env NODE_ENV=test mocha TESTS/notification.routes.test.js TESTS/book.operations.test.js TESTS/review.operations.test.js --timeout 15000 --exit",
  "report:notifications": "cross-env NODE_ENV=test mocha TESTS/notification.routes.test.js TESTS/book.operations.test.js TESTS/review.operations.test.js --reporter mochawesome --reporter-options reportDir=TESTS/prajwalkunwar-report,reportFilename=notifications-report --timeout 15000 --exit"
}
```

---

## Detailed Test Results

### Execution Output

```
> backend@1.0.0 report:notifications
> cross-env NODE_ENV=test mocha TESTS/notification.routes.test.js TESTS/book.operations.test.js TESTS/review.operations.test.js --reporter mochawesome --reporter-options reportDir=TESTS/prajwalkunwar-report,reportFilename=notifications-report --timeout 15000 --exit

[dotenv@17.2.2] injecting env (7) from .env
=================================
🔑 API Key Check:
API Key loaded: true
API Key length: 39
API Key preview: AIzaSyCUtn...
=================================
MongoDB connected


  Notification API (Full Integration)
    ✔ lists notifications for the authenticated user (120ms)
    ✔ marks a single notification as read (194ms)
    ✔ marks all notifications as read (149ms)

  Book Operations API (Full Integration)
    ✔ adds a book to the reading list (456ms)
    ✔ removes a book from the reading list (360ms)
    ✔ moves a book to collections with status update (564ms)

  Review Operations API (Full Integration)
    ✔ submits a new review for a book (348ms)
    ✔ prevents duplicate review submission for the same book (259ms)
    ✔ retrieves all reviews for a specific book (188ms)


  9 passing (9s)

[mochawesome] Report JSON saved to C:\5th semester\Software Eng\swe_project\bookhive\backend\TESTS\prajwalkunwar-report\notifications-report.json

[mochawesome] Report HTML saved to C:\5th semester\Software Eng\swe_project\bookhive\backend\TESTS\prajwalkunwar-report\notifications-report.html
```

---

## Test Suite Details

### 1. Notification API (notification.routes.test.js)

**Endpoint Base:** `/api/notifications`

| Test Case | Method | Endpoint | Expected Result | Status |
|-----------|--------|----------|-----------------|--------|
| Lists notifications for authenticated user | GET | `/api/notifications` | Returns 200 with items array | PASSED |
| Marks single notification as read | PATCH | `/api/notifications/:id/read` | Returns 200, updates read status | PASSED |
| Marks all notifications as read | PATCH | `/api/notifications/read-all` | Returns 200, updates all to read | PASSED |

**Key Testing Points:**
- JWT authentication token validation
- Database query and response validation
- State changes in notification read status

---

### 2. Book Operations API (book.operations.test.js)

**Endpoint Base:** `/api/to-read`

| Test Case | Method | Endpoint | Expected Result | Status |
|-----------|--------|----------|-----------------|--------|
| Adds book to reading list | POST | `/api/to-read/:userId` | Returns 201/200, book added to DB | PASSED |
| Removes book from reading list | DELETE | `/api/to-read/:userId/:googleBookId` | Returns 200, book removed from DB | PASSED |
| Moves book to collections | POST | `/api/to-read/:userId/:googleBookId/move` | Returns 200, book moved with status | PASSED |

**Key Testing Points:**
- Book data structure validation (googleBookId, title, authors, thumbnail, categories)
- ToRead list creation and modification
- Database state verification after operations

---

### 3. Review Operations API (review.operations.test.js)

**Endpoint Base:** `/api/reviews`

| Test Case | Method | Endpoint | Expected Result | Status |
|-----------|--------|----------|-----------------|--------|
| Submits new review | POST | `/api/reviews` | Returns 201, review created in DB | PASSED |
| Prevents duplicate review | POST | `/api/reviews` | Returns 400, maintains single review | PASSED |
| Retrieves reviews by book | GET | `/api/reviews/:googleBookId` | Returns 200 with reviews array | PASSED |

**Key Testing Points:**
- Review data validation (userId, googleBookId, rating, comment)
- Duplicate review prevention logic
- Multi-user review aggregation
- Collection status requirement (only "completed" books can be reviewed)

---

## Automated Test Reports

### HTML Report
**Location:** `backend/TESTS/prajwalkunwar-report/notifications-report.html`

The HTML report provides:
- Interactive test result visualization
- Detailed test execution timeline
- Individual test case pass/fail status
- Execution duration for each test
- Full stack traces (if any failures occurred)

**To view:** Open the HTML file in any web browser

### JSON Report
**Location:** `backend/TESTS/prajwalkunwar-report/notifications-report.json`

The JSON report contains:
- Machine-readable test results
- Complete test suite metadata
- Execution statistics
- Suitable for CI/CD integration

---

## Test Environment Configuration

### Environment Variables
- `NODE_ENV=test` - Ensures test environment
- `MONGO_URI` - MongoDB connection string
- `MONGO_DB_NAME=Bookhive` - Test database name
- `JWT_SECRET` - Authentication token secret

### Database Setup
- Test users created with unique emails per test suite
- Data cleanup performed in `before` and `after` hooks
- Isolation ensured with `afterEach` cleanup for reviews
- All test data removed after execution

---

## Code Coverage

All test files include:
- **Setup hooks** (`before`) - Database connection and test data preparation
- **Teardown hooks** (`after`) - Complete cleanup of test data
- **Test isolation** (`afterEach`) - Prevents test interference
- **Comprehensive assertions** - Validates HTTP status codes, response bodies, and database state

---

## Test Execution Time

- **Total execution time:** 9 seconds
- **Fastest test:** Lists notifications (120ms)
- **Slowest test:** Moves book to collections (564ms)
- **Average test duration:** ~1 second per test

---

## Conclusion

All 9 unit tests for the BookHive Notification System executed successfully. The tests validate:
- API endpoint functionality
- Database operations and state management
- Error handling and validation
- Multi-user scenarios

The automated Mochawesome reports provide comprehensive documentation of test execution without relying on manual screenshots, fulfilling the assignment requirements for automated test reporting.

---

## References

- **Testing Plan:** `backend/TESTS/prajwalkunwar-report/TESTING_PLAN.md`
- **HTML Report:** `backend/TESTS/prajwalkunwar-report/notifications-report.html`
- **JSON Report:** `backend/TESTS/prajwalkunwar-report/notifications-report.json`
- **Test Files:**
  - `backend/TESTS/notification.routes.test.js`
  - `backend/TESTS/book.operations.test.js`
  - `backend/TESTS/review.operations.test.js`
