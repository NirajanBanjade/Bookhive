// backend/TESTS/book.operations.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const User = require("../models/User");
const ToRead = require("../models/ToRead");

describe("Book Operations API (Full Integration)", function () {
  this.timeout(15000);

  const baseUrl = "/api/to-read";
  let userId;
  let testBookId;

  before(async function () {
    // Ensure DB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.MONGO_DB_NAME || "Bookhive",
      });
    }

    // Create a test user
    const user = await User.create({
      username: "BookTestUser",
      email: "booktest@example.com",
      passwordHash: "hashedpassword123",
    });

    userId = user._id.toString();
    testBookId = "testGoogleBook123";

    // Clean any existing ToRead data for this user
    await ToRead.deleteMany({ userId });
  });

  after(async function () {
    // Cleanup
    await ToRead.deleteMany({ userId });
    await User.deleteOne({ _id: userId });

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it("adds a book to the reading list", async function () {
    const bookData = {
      googleBookId: testBookId,
      title: "Test Book Title",
      authors: ["Test Author"],
      thumbnail: "https://example.com/thumbnail.jpg",
      categories: ["Fiction", "Adventure"],
    };

    const res = await request(app)
      .post(`${baseUrl}/${userId}`)
      .send(bookData);

    if (res.status !== 201 && res.status !== 200) {
      throw new Error(`Expected 201 or 200, got ${res.status}`);
    }

    // Verify book was added to database
    const toReadList = await ToRead.findOne({ userId });
    if (!toReadList) throw new Error("ToRead list not created");
    
    const addedBook = toReadList.books.find(b => b.googleBookId === testBookId);
    if (!addedBook) throw new Error("Book not found in ToRead list");
    if (addedBook.title !== "Test Book Title") throw new Error("Book title mismatch");
  });

  it("removes a book from the reading list", async function () {
    // First ensure the book exists
    await ToRead.findOneAndUpdate(
      { userId },
      {
        $addToSet: {
          books: {
            googleBookId: testBookId,
            title: "Test Book Title",
            authors: ["Test Author"],
          },
        },
      },
      { upsert: true }
    );

    const res = await request(app)
      .delete(`${baseUrl}/${userId}/${testBookId}`);

    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}`);
    }

    // Verify book was removed from database
    const toReadList = await ToRead.findOne({ userId });
    const removedBook = toReadList?.books.find(b => b.googleBookId === testBookId);
    if (removedBook) throw new Error("Book still exists in ToRead list");
  });

  it("moves a book to collections with status update", async function () {
    const moveBookId = "moveTestBook456";

    // Add a book first
    await ToRead.findOneAndUpdate(
      { userId },
      {
        $addToSet: {
          books: {
            googleBookId: moveBookId,
            title: "Book to Move",
            authors: ["Move Author"],
          },
        },
      },
      { upsert: true }
    );

    const res = await request(app)
      .post(`${baseUrl}/${userId}/${moveBookId}/move`)
      .send({ status: "currently-reading" });

    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}`);
    }

    // Verify book was removed from ToRead after moving
    const toReadList = await ToRead.findOne({ userId });
    const movedBook = toReadList?.books.find(b => b.googleBookId === moveBookId);
    if (movedBook) throw new Error("Book still in ToRead after moving to collections");
  });
});
