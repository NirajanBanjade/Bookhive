// backend/TESTS/reviewController.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../app");

// Models
const User = require("../models/User");
const Review = require("../models/Review");
const Collection = require("../models/Collection");
const Notification = require("../models/Notification");

describe("Review Controller - Create Review", function () {
  this.timeout(15000);

  const baseUrl = "/api/reviews";
  let token;
  let userId;
  const testGoogleBookId = "test-book-123";

  before(async function () {
    // Ensure DB connection
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.MONGO_DB_NAME || "Bookhive",
      });
    }

    // Clean possible leftovers
    await User.deleteMany({ email: "reviewtest@example.com" });
    await Review.deleteMany({});
    await Collection.deleteMany({});
    await Notification.deleteMany({});

    // Create test user
    const passwordHash = await bcrypt.hash("Test@12345", 10);
    const user = await User.create({
      username: "ReviewTestUser",
      email: "reviewtest@example.com",
      passwordHash,
    });

    userId = user._id.toString();

    // Create JWT token
    token = "Bearer " + jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // IMPORTANT: Create collection with a book so review can be created
    // (Business rule: Book must be in collection to review)
    await Collection.create({
      userId: user._id,
      books: [
        {
          googleBookId: testGoogleBookId,
          status: "completed",
          title: "Test Book for Review",
          addedAt: new Date(),
        },
      ],
    });
  });

  after(async function () {
    // Cleanup test data
    await Review.deleteMany({ userId });
    await Collection.deleteMany({ userId });
    await Notification.deleteMany({ userId });
    await User.deleteOne({ _id: userId });

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it("creates a review for a book in user's collection", async function () {
    const reviewData = {
      userId: userId,
      googleBookId: testGoogleBookId,
      rating: 5,
      comment: "This is an excellent test book!",
      authorName: "Test Author",
    };

    const res = await request(app)
      .post(baseUrl)
      .set("Authorization", token)
      .send(reviewData);

    // Validate response status
    if (res.status !== 201) {
      throw new Error(`Expected 201, got ${res.status}. Error: ${JSON.stringify(res.body)}`);
    }

    // Validate response body has all required fields
    if (!res.body._id) throw new Error("Response missing _id field");
    if (res.body.userId !== userId) throw new Error("Response userId mismatch");
    if (res.body.googleBookId !== testGoogleBookId) throw new Error("Response googleBookId mismatch");
    if (res.body.rating !== 5) throw new Error("Response rating mismatch");
    if (res.body.comment !== "This is an excellent test book!") throw new Error("Response comment mismatch");
    if (res.body.authorName !== "Test Author") throw new Error("Response authorName mismatch");
    if (!res.body.reviewedAt) throw new Error("Response missing reviewedAt timestamp");

    // Verify review was actually saved to database
    const savedReview = await Review.findOne({ 
      userId, 
      googleBookId: testGoogleBookId 
    });
    
    if (!savedReview) throw new Error("Review not found in database");
    if (savedReview.rating !== 5) throw new Error("Database rating mismatch");
    if (savedReview.authorName !== "Test Author") throw new Error("Database authorName mismatch");

    // Verify notification was created (business rule)
    const notification = await Notification.findOne({ 
      userId,
      message: { $regex: /review/i }
    });
    
    if (!notification) throw new Error("Review notification was not created");
  });
});