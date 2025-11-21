// backend/TESTS/review.operations.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

const User = require("../models/User");
const Review = require("../models/Review");
const Collection = require("../models/Collection");

describe("Review Operations API (Full Integration)", function () {
  this.timeout(15000);

  const baseUrl = "/api/reviews";
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
      username: "ReviewTestUser",
      email: "reviewtest@example.com",
      passwordHash: "hashedpassword123",
    });

    userId = user._id.toString();
    testBookId = "reviewTestBook123";

    // Clean any existing data for this user
    await Review.deleteMany({ userId });
    await Collection.deleteMany({ userId });

    // Add book to collection (required for creating reviews)
    await Collection.create({
      userId,
      books: [
        {
          googleBookId: testBookId,
          title: "Test Review Book",
          authors: ["Test Author"],
          status: "completed",
        },
      ],
    });
  });

  after(async function () {
    // Cleanup
    await Review.deleteMany({});
    await Collection.deleteMany({ userId });
    await User.deleteOne({ _id: userId });

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  // Clean ALL reviews after each test
  afterEach(async function () {
    await Review.deleteMany({});
  });

  it("submits a new review for a book", async function () {
    const reviewData = {
      userId,
      googleBookId: testBookId,
      rating: 5,
      comment: "This is an excellent test book!",
    };

    const res = await request(app)
      .post(baseUrl)
      .send(reviewData);

    if (res.status !== 201) {
      throw new Error(`Expected 201, got ${res.status}`);
    }

    // Verify review was created in database
    const review = await Review.findOne({ userId, googleBookId: testBookId });
    if (!review) throw new Error("Review not found in database");
    if (review.rating !== 5) throw new Error("Review rating mismatch");
    if (review.comment !== "This is an excellent test book!") {
      throw new Error("Review comment mismatch");
    }
  });

  it("prevents duplicate review submission for the same book", async function () {
    // First, create a review
    await Review.create({
      userId,
      googleBookId: testBookId,
      rating: 4,
      comment: "First review",
    });

    // Try to create a duplicate review
    const duplicateReviewData = {
      userId,
      googleBookId: testBookId,
      rating: 5,
      comment: "Attempting duplicate review",
    };

    const res = await request(app)
      .post(baseUrl)
      .send(duplicateReviewData);

    if (res.status !== 400) {
      throw new Error(`Expected 400 for duplicate review, got ${res.status}`);
    }

    // Verify only one review exists
    const reviewCount = await Review.countDocuments({ userId, googleBookId: testBookId });
    if (reviewCount !== 1) {
      throw new Error(`Expected 1 review, found ${reviewCount}`);
    }
  });

  it("retrieves all reviews for a specific book", async function () {
    const anotherBookId = "anotherTestBook456";

    // Add another book to collection
    await Collection.findOneAndUpdate(
      { userId },
      {
        $addToSet: {
          books: {
            googleBookId: anotherBookId,
            title: "Another Test Book",
            authors: ["Another Author"],
            status: "completed",
          },
        },
      }
    );

    // Create multiple reviews for the book
    await Review.create([
      {
        userId,
        googleBookId: anotherBookId,
        rating: 4,
        comment: "Good book",
      },
      {
        userId: new mongoose.Types.ObjectId().toString(),
        googleBookId: anotherBookId,
        rating: 5,
        comment: "Excellent book from another user",
      },
    ]);

    const res = await request(app)
      .get(`${baseUrl}/${anotherBookId}`);

    if (res.status !== 200) {
      throw new Error(`Expected 200, got ${res.status}`);
    }

    if (!res.body.reviews || !Array.isArray(res.body.reviews)) {
      throw new Error("Response missing reviews array");
    }

    if (res.body.reviews.length !== 2) {
      throw new Error(`Expected 2 reviews, got ${res.body.reviews.length}`);
    }

    if (res.body.count !== 2) {
      throw new Error(`Expected count of 2, got ${res.body.count}`);
    }
  });
});