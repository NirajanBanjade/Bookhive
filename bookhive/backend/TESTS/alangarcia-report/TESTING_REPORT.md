# BookHive – Unit Test Execution & Results Report  
**Author:** Alan Garcia  
**Course:** CS 3398 – Software Engineering  
**Project:** BookHive  
**Date:** 11/23/2025

---

## 1. Overview

This document provides the execution results for the **three unit tests** created for the recommendaiton feature as part of the team’s testing requirement for the BookHive project.  
These tests correspond directly to the Testing Plan and validate the behavior of:

1. `ExistingBooksRepository.getAllSavedGoogleIds`
2. `InterestProfileBuilder.buildForUser`
3. `RecommendationService.recommend`

All tests were implemented using **Mocha**, **Chai**, and **Sinon**, consistent with the team’s existing backend testing framework.  
All three tests executed successfully and passed.

---

## 2. Test Environment

- **Node.js:** v18+  
- **Testing Framework:** Mocha  
- **Assertion Library:** Chai  
- **Mocking/Stubbing:** Sinon  
- **Operating System:** Windows 11  
- **Project Mode:** `NODE_ENV=test`

Tests were executed using the custom script:
```bash
npm run test:recommendations
```

Which runs one of the following:

mocha TESTS/existingBooksRepository.test.js  
      TESTS/interestProfileBuilder.test.js  
      TESTS/recommendationService.test.js

---

## 3. Evidence of Test Execution

Below is the console output captured when running the tests.
All tests passed with no failures or warnings.

```bash
> backend@1.0.0 test:recommendations
> cross-env NODE_ENV=test mocha TESTS/existingBooksRepository.test.js TESTS/interestProfileBuilder.test.js TESTS/recommendationService.test.js --timeout 10000


  ExistingBooksRepository.getAllSavedGoogleIds
    ✓ merges To-Read, currently-reading, and completed ids with deduplication

  InterestProfileBuilder.buildForUser
    ✓ builds a normalized author and category profile and persists it

  RecommendationService.recommend
    ✓ scores candidates, sorts by score desc, and respects limit


  3 passing (25ms)
```
---

## 4. Summary of Test Results

### Test 1 — ExistingBooksRepository.getAllSavedGoogleIds

#### Purpose:
Validate that the repository correctly merges saved Google Book IDs from:

- To-Read list

- Currently-Reading list

- Completed list

while ignoring invalid statuses and deduplicating IDs.

#### Result:

- Test passed successfully

- Returned a Set containing exactly the expected IDs (A, B, C)

- Ignored entries with missing IDs or incorrect status

- Verified query calls to both models

### Test 2 — InterestProfileBuilder.buildForUser

#### Purpose:
Verify that the InterestProfileBuilder:

- Retrieves all books across To-Read, Currently-Reading, and Completed

- Fetches Google Books volume info

- Aggregates authors, categories, and keywords

- Normalizes weights into the range [0, 1]

- Calls profileRepo.upsert with the correct structure

- Returns { profile, warnings } correctly

#### Result:

- Test passed successfully

- Authors normalized correctly (alice → 1.0, bob → 0.5)

- Categories normalized correctly (fantasy → 1.0, horror → 0.5)

- sourceCounts.toRead equaled 2 as expected

- profileRepo.upsert invoked with the correct data

- No warnings were generated

### Test 3 — RecommendationService.recommend

#### Purpose:
Validate the recommendation pipeline:

- Ensures a valid profile exists

- Calls candidate generator with limit * 3

- Extracts features per candidate

- Scores each book

- Sorts by score (and scoreHint when tied)

- Returns top results within the specified limit

#### Result:

- Test passed successfully

- Generator correctly called with { limit: 6 } for requested limit 2

- Candidates sorted correctly in descending score order

- Returned IDs were ["c2", "c3"] (highest scoring)

- Returned object matched expected structure: { reason: "ok", items: [...] }

---

## 5. Conclusion

All three unit tests executed with 100% passing results.
These tests validate key components of the recommendation feature architecture and meet all assignment requirements:

- Tests targeted complex classes and methods

- Tested logic using internal state and return objects

- Used mocking and stubbing to isolate unit functionality

- Provided complete evidence of successful execution

All test files and this report have been committed under:

```bash
backend/TESTS/alangarcia/
```