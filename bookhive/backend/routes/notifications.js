const express = require("express");
const router = express.Router();
const controller = require("../controllers/notificationController");

// List notifications for a user: GET /api/notifications?userId=...&limit=20
router.get("/", controller.list);

// Mark a single notification as read: POST /api/notifications/:id/read
router.post("/:id/read", controller.markRead);

// Mark all notifications as read for a user: POST /api/notifications/read-all
router.post("/read-all", controller.markAllRead);

module.exports = router;
