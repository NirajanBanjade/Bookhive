// backend/TESTS/collectionsController.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../app");

// Models
const User = require("../models/User");
const Collection = require("../models/Collection");

describe("Collections Controller - Add Book to Collection", function () {
  this.timeout(15000);

  let token;
  let userId;

  before(async function () {
    // Ensure DB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.MONGO_DB_NAME || "Bookhive",
      });
    }

    // Clean possible leftovers
    await User.deleteMany({ email: "collectiontest@example.com" });
    await Collection.deleteMany({});

    // Create test user
    const passwordHash = await bcrypt.hash("Test@12345", 10);
    const user = await User.create({
      username: "CollectionTestUser",
      email: "collectiontest@example.com",
      passwordHash,
    });

    userId = user._id.toString();

    // Create JWT token
    token = "Bearer " + jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  after(async function () {
    // Cleanup test data
    await Collection.deleteMany({ userId });
    await User.deleteOne({ _id: userId });

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it("adds a book to user's collection with status", async function () {
    const bookData = {
      googleBookId: "test-collection-book-456",
      title: "Test Collection Book",
      authors: ["Test Author"],
      thumbnail: "http://example.com/thumbnail.jpg",
      categories: ["Fiction", "Test"],
      status: "currently-reading",
    };

    const baseUrl = `/api/collections/${userId}`;
    
    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", token)
      .send(bookData);

    // Validate response status
    if (res.status !== 201) {
      throw new Error(`Expected 201, got ${res.status}. Error: ${JSON.stringify(res.body)}`);
    }

    // Validate response has userId and books array
    if (!res.body.userId) throw new Error("Response missing userId field");
    if (!Array.isArray(res.body.books)) throw new Error("Response missing books array");
    if (res.body.books.length === 0) throw new Error("Books array is empty");

    // Find the added book in the response
    const addedBook = res.body.books.find(b => b.googleBookId === "test-collection-book-456");
    if (!addedBook) throw new Error("Book not found in response books array");
    
    // Validate book fields
    if (addedBook.title !== "Test Collection Book") throw new Error("Book title mismatch");
    if (addedBook.status !== "currently-reading") throw new Error("Book status mismatch");
    if (!Array.isArray(addedBook.authors)) throw new Error("Authors should be an array");
    if (addedBook.authors[0] !== "Test Author") throw new Error("Author name mismatch");

    // Verify book was actually saved to database
    const savedCollection = await Collection.findOne({ userId });
    
    if (!savedCollection) throw new Error("Collection not found in database");
    
    const savedBook = savedCollection.books.find(b => b.googleBookId === "test-collection-book-456");
    if (!savedBook) throw new Error("Book not found in database collection");
    if (savedBook.status !== "currently-reading") throw new Error("Database status mismatch");
    if (savedBook.title !== "Test Collection Book") throw new Error("Database title mismatch");
  });
});