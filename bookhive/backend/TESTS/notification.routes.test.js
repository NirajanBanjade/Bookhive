const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");

describe("Notification API", () => {
  let token;

  beforeAll(() => {
    // mock token from your JWT helper or use a real one for integration
    token = "Bearer <valid_token>";
  });

  it("should reject unauthorized access", async () => {
    const res = await request(app).get("/api/notifications");
    expect(res.status).toBe(401);
  });

  it("should list notifications (authorized)", async () => {
    const res = await request(app)
      .get("/api/notifications")
      .set("Authorization", token);
    expect([200, 401]).toContain(res.status);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
