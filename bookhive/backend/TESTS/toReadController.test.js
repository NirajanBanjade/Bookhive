// backend/TESTS/toReadController.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../app");

// Models
const User = require("../models/User");
const ToRead = require("../models/ToRead");
const Notification = require("../models/Notification");

describe("To-Read Controller - Add Book to To-Read List", function () {
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
    await User.deleteMany({ email: "toreadtest@example.com" });
    await ToRead.deleteMany({});
    await Notification.deleteMany({});

    // Create test user
    const passwordHash = await bcrypt.hash("Test@12345", 10);
    const user = await User.create({
      username: "ToReadTestUser",
      email: "toreadtest@example.com",
      passwordHash,
    });

    userId = user._id.toString();

    // Create JWT token
    token = "Bearer " + jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  after(async function () {
    // Cleanup test data
    await ToRead.deleteMany({ userId });
    await Notification.deleteMany({ userId });
    await User.deleteOne({ _id: userId });

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it("adds a book to user's to-read list and creates notification", async function () {
    const bookData = {
      googleBookId: "test-toread-book-789",
      title: "Test To-Read Book",
      authors: ["Test Author"],
      thumbnail: "http://example.com/toread-thumbnail.jpg",
      categories: ["Fiction", "Adventure"],
    };

    const baseUrl = `/api/to-read/${userId}`;
    
    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", token)
      .send(bookData);

    // Validate response status (201 for new addition)
    if (res.status !== 201 && res.status !== 200) {
      throw new Error(`Expected 201 or 200, got ${res.status}. Error: ${JSON.stringify(res.body)}`);
    }

    // Validate response has userId and books array
    if (!res.body.userId) throw new Error("Response missing userId field");
    if (!Array.isArray(res.body.books)) throw new Error("Response missing books array");
    if (res.body.books.length === 0) throw new Error("Books array is empty");

    // Find the added book in the response
    const addedBook = res.body.books.find(b => b.googleBookId === "test-toread-book-789");
    if (!addedBook) throw new Error("Book not found in response books array");
    
    // Validate book fields
    if (addedBook.title !== "Test To-Read Book") throw new Error("Book title mismatch");
    if (!Array.isArray(addedBook.authors)) throw new Error("Authors should be an array");
    if (addedBook.authors[0] !== "Test Author") throw new Error("Author name mismatch");
    // Note: addedAt may not be in response, but should be in database

    // Verify book was actually saved to database
    const savedToRead = await ToRead.findOne({ userId });
    
    if (!savedToRead) throw new Error("To-Read list not found in database");
    
    const savedBook = savedToRead.books.find(b => b.googleBookId === "test-toread-book-789");
    if (!savedBook) throw new Error("Book not found in database to-read list");
    if (savedBook.title !== "Test To-Read Book") throw new Error("Database title mismatch");

    // Verify notification was created (business rule: domain event triggers notification)
    const notification = await Notification.findOne({ 
      userId,
      message: { $regex: /to-read|added/i }
    });
    
    if (!notification) throw new Error("To-Read notification was not created");
  });
});