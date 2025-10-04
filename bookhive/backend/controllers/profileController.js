const getUser = require("../models/User");

/**
 * GET /api/profile/:userId
 * Fetches public profile information for any user
 * Used by ProfileView component for read-only display
 * Used by ProfileForm component to load current user data
 */
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by MongoDB _id, exclude sensitive fields like passwordHash
    const user = await getUser.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return sanitized user data safe for frontend consumption
    res.json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name || user.username,
        email: user.email, // Returned for display but cannot be edited
        bio: user.bio,
        profileImageUrl: user.profileImageUrl,
        booksRead: user.booksRead,
        currentlyReading: user.currentlyReading,
        wantToRead: user.wantToRead,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /api/profile
 * Updates current user's profile information
 * Protected route - requires valid JWT token
 * Used by ProfileForm component when user saves changes
 *
 * EDITABLE FIELDS: name, bio
 * NON-EDITABLE FIELDS: email (requires separate verification flow for security)
 */
const updateProfile = async (req, res) => {
  try {
    // Get user ID from JWT token (set by authenticateToken middleware)
    const userId = req.user.id;

    // Only allow updating name and bio
    // Email is excluded for security - changing email requires separate verification
    const { name, bio } = req.body;

    // Build update object with only allowed fields
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;

    // Update user profile fields in MongoDB
    // new: true returns updated document
    // runValidators: true runs schema validation on update
    const updatedUser = await getUser.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return success message and updated user data
    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        email: updatedUser.email, // Return for display but wasn't updated
        bio: updatedUser.bio,
        profileImageUrl: updatedUser.profileImageUrl,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Export functions for use in routes
module.exports = { getUserProfile, updateProfile };
