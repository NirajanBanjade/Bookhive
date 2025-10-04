const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/jwt_auth");
const {
  getUserProfile,
  updateProfile,
} = require("../controllers/profileController");

/**
 * PROFILE API ROUTES
 * Base path: /api/profile
 *
 * These routes serve the React Profile components:
 * - ProfileView (read-only profile display)
 * - ProfileForm (editable profile for current user)
 *
 * Security Note:
 * - Email is NOT editable through profile update (requires separate verification flow)
 * - Only name and bio can be updated via PUT /api/profile
 */

// GET /api/profile/:userId - Fetch any user's profile (public)
// Example: GET /api/profile/507f1f77bcf86cd799439011
// Returns: user data including email (for display only, not editable)
router.get("/:userId", getUserProfile);

// PUT /api/profile - Update current user's profile (protected)
// Requires: Authorization: Bearer <jwt_token> header
// Body: { name: "John Doe", bio: "Book lover" }
// Note: Email cannot be changed through this endpoint
router.put("/", authenticateToken, updateProfile);

// TODO: Future endpoints to implement:
// POST /api/profile/avatar - Upload profile picture
// PUT /api/profile/email - Change email (requires verification + 2FA)

module.exports = router;
