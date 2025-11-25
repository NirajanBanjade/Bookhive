# Test Execution Results - BookHive Core Features
**Project:** BookHive  
**Developer:** Aevin  
**Task:** Sprint Assignment 14 - Test Execution  
**Date:** November 25, 2025  
**Sprint:** Sprint 3

---

## Overview

This document provides comprehensive documentation of unit test execution for BookHive's core book management features. All tests were executed using the Mocha testing framework with automated reporting via Mochawesome.

### Features Tested

1. **Review Controller** - Review creation with validation and notifications
2. **Collections Controller** - Book collection management with status tracking  
3. **To-Read Controller** - To-read list management with domain events

---

## Test Execution Summary

A total of **3 unit tests** were executed across 3 test suites, all of which **passed successfully**.

| Test Suite | Test File | Tests | Status |
|------------|-----------|-------|--------|
| Review Controller | `reviewController.test.js` | 1 | ✅ PASSED |
| Collections Controller | `collectionsController.test.js` | 1 | ✅ PASSED |
| To-Read Controller | `toReadController.test.js` | 1 | ✅ PASSED |
| **TOTAL** | **3 files** | **3** | **✅ ALL PASSED** |

---

## Tools and Dependencies

The following testing tools and frameworks were used:

- **Mocha** (v11.7.4) - Testing framework
- **Supertest** (v7.1.4) - HTTP assertion library for API testing
- **Mochawesome** (v7.1.4) - HTML/JSON test reporter
- **MongoDB** - Test database
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing for test users
- **jsonwebtoken** - JWT authentication

---

## Test Execution Commands

### Run All Tests with HTML Report Generation
```bash
npx mocha TESTS/reviewController.test.js TESTS/collectionsController.test.js TESTS/toReadController.test.js --reporter mochawesome --reporter-options reportDir=TESTS/aevin-report,reportFilename=aevin-report --timeout 10000 --exit
```

### Run Tests Without Report (Quick Check)
```bash
npx mocha TESTS/reviewController.test.js TESTS/collectionsController.test.js TESTS/toReadController.test.js --timeout 10000 --exit
```

---

## Detailed Test Results

### Execution Output

```
  Review Controller - Create Review
MongoDB connected
    ✔ creates a review for a book in user's collection (345ms)

  Collections Controller - Add Book to Collection
MongoDB connected
    ✔ adds a book to user's collection with status (211ms)

  To-Read Controller - Add Book to To-Read List
MongoDB connected
    ✔ adds a book to user's to-read list and creates notification (298ms)

  3 passing (5.7s)

[mochawesome] Report JSON saved to TESTS/aevin-report/aevin-report.json
[mochawesome] Report HTML saved to TESTS/aevin-report/aevin-report.html
```


---

## Test Suite Details

### 1. Review Controller (reviewController.test.js)

**Endpoint:** `POST /api/reviews`

| Test Case | Expected Result | Status | Time |
|-----------|-----------------|--------|------|
| Creates review for book in user's collection | Returns 201, review saved to DB, notification created | ✅ PASSED | 345ms |

**Key Testing Points:**
- JWT authentication validation
- All required fields validated (userId, googleBookId, rating, comment, authorName)
- Business rule: Book must be in collection before review
- Database persistence verification
- Notification generation via NotificationService

---

### 2. Collections Controller (collectionsController.test.js)

**Endpoint:** `POST /api/collections/:userId`

| Test Case | Expected Result | Status | Time |
|-----------|-----------------|--------|------|
| Adds book to user's collection with status | Returns 201, book added to collection array | ✅ PASSED | 211ms |

**Key Testing Points:**
- Book data structure validation (googleBookId, title, authors, thumbnail, categories)
- Status field validation ('currently-reading', 're-reading', 'completed')
- Collection document creation/update
- Books array structure verification
- Database state verification

---

### 3. To-Read Controller (toReadController.test.js)

**Endpoint:** `POST /api/to-read/:userId`

| Test Case | Expected Result | Status | Time |
|-----------|-----------------|--------|------|
| Adds book to to-read list and creates notification | Returns 201/200, book added, notification created | ✅ PASSED | 298ms |

**Key Testing Points:**
- Book addition to to-read list
- ToRead document creation/update
- Books array structure validation
- Notification creation via domain events
- Database persistence verification

---

## Automated Test Reports

### HTML Report
**Location:** `backend/TESTS/aevin-report/aevin-report.html`

The HTML report provides:
- Interactive test result visualization
- Detailed test execution timeline
- Individual test case pass/fail status
- Execution duration for each test
- Full test code and assertions

**To view:** Open the HTML file in any web browser

### JSON Report
**Location:** `backend/TESTS/aevin-report/aevin-report.json`

The JSON report contains:
- Machine-readable test results
- Complete test suite metadata
- Execution statistics
- Suitable for CI/CD integration

---

## Test Environment Configuration

### Environment Variables
- `MONGO_URI` - MongoDB connection string
- `MONGO_DB_NAME=Bookhive` - Test database name
- `JWT_SECRET` - Authentication token secret

### Database Setup
- Test users created with unique emails per test suite
- Data cleanup performed in `before` and `after` hooks
- Complete test isolation with separate users
- All test data removed after execution

---

## Test Execution Time

- **Total execution time:** 5.7 seconds
- **Review Controller test:** 345ms
- **Collections Controller test:** 211ms
- **To-Read Controller test:** 298ms
- **Average test duration:** ~285ms per test

---

## Conclusion

All 3 unit tests for BookHive's core features executed successfully. The tests validate:
- API endpoint functionality with proper HTTP status codes
- Database operations and state management
- Business rule enforcement (e.g., book must be in collection before review)
- Notification generation through services and domain events
- Complete request/response cycle validation

The automated Mochawesome reports provide comprehensive documentation of test execution without relying on manual screenshots, fulfilling the assignment requirements for automated test reporting.

---

## References

- **Testing Plan:** `backend/TESTS/TESTING_PLAN.md`
- **HTML Report:** `backend/TESTS/aevin-report/aevin-report.html`
- **JSON Report:** `backend/TESTS/aevin-report/aevin-report.json`
- **Test Files:**
  - `backend/TESTS/reviewController.test.js`
  - `backend/TESTS/collectionsController.test.js`
  - `backend/TESTS/toReadController.test.js`