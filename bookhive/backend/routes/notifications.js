// backend/routes/notifications.js
const express = require("express");
const router = express.Router();
const { list } = require("../controllers/notificationController");
const auth = require("../middleware/jwt_auth"); // adjust if your auth file name differs

// GET /api/notifications
router.get("/", auth, list);

module.exports = router;
