// backend/TESTS/notification.routes.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const app = require("../app");

// Adjust these requires if your file names/paths differ
const User = require("../models/User");
const Notification = require("../models/Notification");

describe("Notification API (Full Integration)", function () {
  this.timeout(15000);

  const baseUrl = "/api/notifications";
  let token;
  let userId;

  before(async function () {
    // Ensure DB connection (skip if app.js already connected — harmless if double)
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI, {
        dbName: process.env.MONGO_DB_NAME || "Bookhive",
      });
    }

    // Clean possible leftovers
    await User.deleteMany({ email: "testuser@example.com" });
    await Notification.deleteMany({});

    //  Create a user that matches your schema requirements
    const passwordHash = await bcrypt.hash("Test@12345", 10);
    const user = await User.create({
      username: "TestUser",
      email: "testuser@example.com",
      passwordHash, // IMPORTANT: your schema likely requires this field
      // add any other required fields here if your User schema needs them
    });

    userId = user._id.toString();

    // Sign a real JWT using your real secret
    token = "Bearer " + jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Seed a couple notifications for this user
    await Notification.create([
      { userId, message: "Welcome to BookHive!", type: "info" },
      { userId, message: "You added a book to your To-Read list.", type: "success" },
    ]);
  });

  after(async function () {
    // Cleanup artifacts created by the test
    await Notification.deleteMany({ userId });
    await User.deleteOne({ _id: userId });

    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it("lists notifications for the authenticated user", async function () {
    const res = await request(app).get(baseUrl).set("Authorization", token);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!Array.isArray(res.body.items)) throw new Error("Response missing items array");
  });

  it("marks a single notification as read", async function () {
    const all = await Notification.find({ userId });
    const target = all[0];

    const res = await request(app)
      .patch(`${baseUrl}/${target._id}/read`)
      .set("Authorization", token);

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);

    const updated = await Notification.findById(target._id);
    if (!updated.read) throw new Error("Notification not marked as read");
  });

  it("marks all notifications as read", async function () {
    const res = await request(app)
      .patch(`${baseUrl}/read-all`)
      .set("Authorization", token);

    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);

    const unread = await Notification.find({ userId, read: false });
    if (unread.length !== 0) throw new Error("Some notifications remain unread");
  });
});
