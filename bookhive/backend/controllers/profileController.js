const User = require("../models/User");

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
    const user = await User.findById(userId);

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
        location: user.location, // Added location field
        profileImageUrl: user.profileImageUrl,
        booksRead: user.booksRead,
        currentlyReading: user.currentlyReading,
        wantToRead: user.wantToRead,
      },
    });
  } catch (err) {
    console.error('Error fetching user profile:', err);
    res.status(500).json({ error: err.message });
  }
};

/**
 * PUT /api/profile
 * Updates current user's profile information
 * Protected route - requires valid JWT token
 * Used by ProfileForm component when user saves changes
 *
 * EDITABLE FIELDS: username, name, bio, location, profileImageUrl
 * NON-EDITABLE FIELDS: email (requires separate verification flow for security)
 */
const updateProfile = async (req, res) => {
  try {
    // Get user ID from JWT token (set by authenticateToken middleware)
    const userId = req.user.id;

    // Extract allowed fields from request body
    const { username, name, bio, location, profileImageUrl } = req.body;

    // Build update object with only allowed fields
    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (name !== undefined) updateData.name = name;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (profileImageUrl !== undefined) updateData.profileImageUrl = profileImageUrl;

    // Update user profile fields in MongoDB
    // new: true returns updated document
    // runValidators: true runs schema validation on update
    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
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
        location: updatedUser.location,
        profileImageUrl: updatedUser.profileImageUrl,
      },
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    
    // Handle duplicate username error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.username) {
      return res.status(400).json({ error: 'Username already exists. Please choose a different username.' });
    }
    
    res.status(500).json({ error: err.message || 'Failed to update profile' });
  }
};

// Export functions for use in routes
module.exports = { getUserProfile, updateProfile };