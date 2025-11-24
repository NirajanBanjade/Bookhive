# BookHive – Testing Plan (Alan – Recommendation Feature)

## Overview

This testing plan covers **three backend unit tests** for the BookHive book recommendation feature.  
The tests focus on the following classes:

1. `ExistingBooksRepository.getAllSavedGoogleIds`
2. `InterestProfileBuilder.buildForUser`
3. `RecommendationService.recommend`

All three targets are non-trivial classes that use internal fields and return structured objects, as required by the assignment.

---

## Test 1 – ExistingBooksRepository merges all saved books

**Code under test**

- File: `backend/repositories/ExistingBooksRepository.js`
- Class: `ExistingBooksRepository`
- Method: `async getAllSavedGoogleIds(userId)`

**Context / Purpose**

This repository is responsible for collecting all Google Book IDs that the user has already saved in any list. It currently uses:

- The `ToRead` model (user’s “To-Read” collection)
- The `Collection` model (combined “Currently Reading” + “Completed” collection, filtered by status)

The test ensures that:

- IDs from **To-Read**, **currently-reading**, and **completed** books are all included.
- Only valid `googleBookId` values are used.
- IDs are **deduplicated** across lists.

**Scenario**

- Given a user with:
  - To-Read: books `A`, `B`
  - Collection:
    - `B` with status `"currently-reading"` (duplicate)
    - `C` with status `"completed"`
    - `D` with status `"to-read"` (should be ignored)
- When `getAllSavedGoogleIds(userId)` is called
- Then the returned `Set` should contain `{ "A", "B", "C" }` and **not** contain `"D"`.

**Inputs**

- `userId = "user-123"`
- Stubbed `ToRead.findOne` and `Collection.findOne` return mocked documents as above.

**Expected Output**

- Type: `Set<string>`
- Contents: `{ "A", "B", "C" }`
- Size: `3`

---

## Test 2 – InterestProfileBuilder builds normalized author/category/keyword profile

**Code under test**

- File: `backend/services/InterestProfileBuilder.js`
- Class: `InterestProfileBuilder`
- Method: `async buildForUser(userId)`

**Context / Purpose**

`InterestProfileBuilder` constructs a **user interest profile** from their saved books by:

- Fetching books from:
  - `ToReadRepository.getBooksForUser(userId)`
  - `CollectionRepository.getBooksByStatus(userId, "currently-reading")`
  - `CollectionRepository.getBooksByStatus(userId, "completed")`
- Calling `booksServiceGetVolume(googleBookId)` to get `volumeInfo`
- Aggregating:
  - `authors` → `authorCounts`
  - `categories` → `categoryCounts`
  - description tokens → `keywordTF` via `tokenizer.tokens(description)`
- Normalizing each channel with `_normalize(...)` to produce weights in `[0, 1]`
- Calling `profileRepo.upsert(userId, profile)` to persist
- Returning `{ profile, warnings }`

**Scenario**

- Given:
  - User has 2 saved books `A` and `B`
  - Volume `A`:
    - authors: `["Alice"]`
    - categories: `["Fantasy"]`
    - description: `"magic dragon"`
  - Volume `B`:
    - authors: `["Alice", "Bob"]`
    - categories: `["Fantasy", "Horror"]`
    - description: `"dragon knight"`
  - The tokenizer splits descriptions into lowercase tokens.
- When `buildForUser("user-123")` is called
- Then:
  - Authors:
    - `alice` appears in 2 books → weight `1.0`
    - `bob` appears in 1 book → weight `0.5`
  - Categories:
    - `fantasy` appears in 2 books → weight `1.0`
    - `horror` appears in 1 book → weight `0.5`
  - `profileRepo.upsert` is called with:
    - `userId`
    - `authors`, `categories`, `keywords`
    - `sourceCounts.toRead = 2`
  - The returned `profile` in `{ profile, warnings }` matches what `upsert` resolved to.

**Inputs**

- `userId = "user-123"`
- `toReadRepo.getBooksForUser` returns 2 books with `googleBookId` "A" and "B".
- `collectionRepo.getBooksByStatus` returns empty arrays.
- `booksServiceGetVolume(id)` returns the mocked `volumeInfo`s above.
- `tokenizer.tokens` splits by whitespace and lowercases.

**Expected Output**

- Return object: `{ profile, warnings }`
- `warnings` is an empty array.
- `profile.authors` contains `alice` (weight 1) and `bob` (weight 0.5).
- `profile.categories` contains `fantasy` (weight 1) and `horror` (weight 0.5).
- `profile.sourceCounts.toRead === 2`.

---

## Test 3 – RecommendationService.recommend scores and orders candidates

**Code under test**

- File: `backend/services/RecommendationService.js`
- Class: `RecommendationService`
- Method: `async recommend({ userId, limit = 20 })`

**Context / Purpose**

`RecommendationService.recommend`:

1. Calls `this._getFreshProfile(userId)` to obtain an interest profile.
2. If no profile, returns `{ reason: "no_profile", items: [] }`.
3. Calls `candidateGenerator.generate({ userId, limit: limit * 3 })` to get raw candidates.
4. For each candidate:
   - Extracts `volumeInfo` (or `{}` if missing).
   - Calls `featureExtractor.extract(volumeInfo)` → features.
   - Calls `scoring.score(profile, features)` → numeric score.
5. Builds a list of `{ id, source, scoreHint, score, volumeInfo }`.
6. Sorts by `score` desc, then `scoreHint` desc, and trims to `limit`.
7. Returns `{ reason: "ok", items: [...] }`.

**Scenario**

- Given:
  - A valid profile is returned by `_getFreshProfile`.
  - `candidateGenerator.generate` returns 3 candidates: `c1`, `c2`, `c3`.
  - `scoring.score` returns:
    - `c1` → 0.2
    - `c2` → 0.9
    - `c3` → 0.5
- When `recommend({ userId: "user-123", limit: 2 })` is called
- Then:
  - `candidateGenerator.generate` is called with `limit: 6` (`limit * 3`).
  - The returned object has `reason === "ok"`.
  - `items` length is `2`.
  - The order of IDs in `items` is `["c2", "c3"]` (sorted by score desc).

**Inputs**

- `userId = "user-123"`, `limit = 2`
- `_getFreshProfile` stubbed to return a fake profile.
- `candidateGenerator.generate` stubbed to return 3 candidates.
- `featureExtractor.extract` can be a simple identity-style stub.
- `scoring.score` stubbed to return the desired scores.

**Expected Output**

- Return object: `{ reason: "ok", items: [ ... ] }`
- `items.map(i => i.id) === ["c2", "c3"]`
- `candidateGenerator.generate` called once with `{ userId: "user-123", limit: 6 }`.

