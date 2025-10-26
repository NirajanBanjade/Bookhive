const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/jwt_auth");
const {
  getUserProfile,
  updateProfile,
} = require("../controllers/profileController");

/**
 * PROFILE API ROUTES
 * Mounted at: /api/user (in app.js) AND /api/profile (in app.js)
 *
 * These routes serve the React Profile components:
 * - ProfileView (read-only profile display)
 * - ProfileForm (editable profile for current user)
 *
 * Security Note:
 * - Email is NOT editable through profile update (requires separate verification flow)
 * - Name, bio, location, profileImageUrl, and username can be updated
 */

// GET /api/profile/:userId OR /api/user/:userId - Fetch any user's profile (public)
// Example: GET /api/profile/507f1f77bcf86cd799439011
// Returns: user data including email (for display only, not editable)
router.get("/:userId", getUserProfile);

// PUT /api/profile OR /api/user/profile - Update current user's profile (protected)
// Requires: Authorization: Bearer <jwt_token> header
// Body: { username, name, bio, location, profileImageUrl }
// Note: Email cannot be changed through this endpoint
router.put("/", authenticateToken, updateProfile);
router.put("/profile", authenticateToken, updateProfile);  // Alternative path for frontend

// TODO: Future endpoints to implement:
// POST /api/profile/avatar - Upload profile picture
// PUT /api/profile/email - Change email (requires verification + 2FA)

module.exports = router;