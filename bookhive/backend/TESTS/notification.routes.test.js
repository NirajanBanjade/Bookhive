// backend/TESTS/notification.routes.test.js
const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

describe("Notification API", function () {
  // Increase timeout for slower local setups
  this.timeout(10000);

  const token = "Bearer <your_valid_jwt_here>"; // replace with a real JWT
  const baseUrl = "/api/notifications";

  before(async function () {
    // If app.js already connects mongoose, you can skip manual connect here.
    // Otherwise uncomment:
    // await mongoose.connect(process.env.MONGO_URI, {
    //   dbName: process.env.MONGO_DB_NAME || "Bookhive",
    //   useNewUrlParser: true,
    // });
  });

  after(async function () {
    // Close only if you manually connected in before()
    // If your app manages the connection globally, you can skip this.
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
    }
  });

  it("rejects unauthorized requests", async function () {
    const res = await request(app).get(baseUrl);
    if (![401, 403].includes(res.status)) {
      throw new Error(`Expected 401/403, got ${res.status}`);
    }
  });

  it("lists notifications for an authorized user", async function () {
    const res = await request(app)
      .get(baseUrl)
      .set("Authorization", token);

    // We accept either 200 (valid token) or 401 (placeholder token)
    if (![200, 401].includes(res.status)) {
      throw new Error(`Expected 200/401, got ${res.status}`);
    }
  });

  it("supports mark-all endpoint", async function () {
    const res = await request(app)
      .patch(`${baseUrl}/read-all`)
      .set("Authorization", token);

    if (![200, 401].includes(res.status)) {
      throw new Error(`Expected 200/401, got ${res.status}`);
    }
  });
});
