// backend/routes/notifications.js
const express = require("express");
const router = express.Router();
const { list, markRead, markAllRead } = require("../controllers/notificationController");
const auth = require("../middleware/jwt_auth");

// GET /api/notifications → list user notifications
router.get("/", auth, list);

// PATCH /api/notifications/:id/read → mark single notification as read
router.patch("/:id/read", auth, markRead);

// PATCH /api/notifications/read-all → mark all notifications as read
router.patch("/read-all", auth, markAllRead);

module.exports = router;
