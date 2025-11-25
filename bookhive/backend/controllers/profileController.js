const User = require("../models/User");
const NotificationService = require("../services/NotificationService"); 

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

    // KAN-92: Get current user data to track changes
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Build update object with only allowed fields
    const updateData = {};
    const updatedFields = []; // KAN-92: Track which fields were updated

    if (username !== undefined && username !== currentUser.username) {
      updateData.username = username;
      updatedFields.push('username');
    }
    if (name !== undefined && name !== currentUser.name) {
      updateData.name = name;
      updatedFields.push('name');
    }
    if (bio !== undefined && bio !== currentUser.bio) {
      updateData.bio = bio;
      updatedFields.push('bio');
    }
    if (location !== undefined && location !== currentUser.location) {
      updateData.location = location;
      updatedFields.push('location');
    }
    if (profileImageUrl !== undefined && profileImageUrl !== currentUser.profileImageUrl) {
      updateData.profileImageUrl = profileImageUrl;
      updatedFields.push('profile picture');
    }

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

    // KAN-92: Create specific notifications for profile updates
    try {
      if (updatedFields.length > 0) {
        // Create specific notifications for certain field updates
        if (updatedFields.includes('username')) {
          await NotificationService.createUsernameUpdatedNotification(
            userId,
            currentUser.username,
            updatedUser.username
          );
        }
        if (updatedFields.includes('bio')) {
          await NotificationService.createBioUpdatedNotification(userId);
        }
        if (updatedFields.includes('location')) {
          await NotificationService.createLocationUpdatedNotification(
            userId,
            updatedUser.location
          );
        }
        
        // If multiple fields or other fields updated, create general notification
        if (updatedFields.length > 1 || 
            updatedFields.some(field => !['username', 'bio', 'location'].includes(field))) {
          await NotificationService.createProfileUpdatedNotification(userId, updatedFields);
        }
      }
    } catch (notifErr) {
      console.error('Error creating profile update notification:', notifErr);
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

/**
 * POST /api/profile/upload-avatar
 * Uploads user's profile picture
 * Protected route - requires valid JWT token
 * Handles file upload via multer middleware
 */
const uploadAvatar = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const userId = req.user.id;

    // Construct the URL path for the uploaded image
    const profileImageUrl = `/uploads/profiles/${req.file.filename}`;

    // Update user's profileImageUrl in database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profileImageUrl },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // KAN-92: Create notification for profile picture update
    try {
      await NotificationService.createProfilePictureUpdatedNotification(userId);
    } catch (notifErr) {
      console.error('Error creating profile picture notification:', notifErr);
    }

    res.json({
      message: 'Profile picture uploaded successfully',
      profileImageUrl: profileImageUrl,
      user: {
        id: updatedUser._id,
        username: updatedUser.username,
        name: updatedUser.name,
        profileImageUrl: updatedUser.profileImageUrl,
      }
    });
  } catch (err) {
    console.error('Error uploading avatar:', err);
    res.status(500).json({ error: err.message || 'Failed to upload profile picture' });
  }
};

// Export functions for use in routes
module.exports = { getUserProfile, updateProfile, uploadAvatar };
