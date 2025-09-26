import React, { useState } from "react";
import "./Profile.css";

// ProfileForm Component - Full editing functionality for user's own profile
// Contains all the logic from your original Profile.jsx component
const ProfileForm = ({ userData = null, onSave = null }) => {
  // Default user data - matches your original code exactly
  const defaultUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Avid reader and book enthusiast. Love fantasy, sci-fi, and mystery novels.",
    profileImageUrl: null, // Using your exact field name
  };

  const initialUser = userData || defaultUser;

  // State management - exactly matching your original Profile.jsx
  const [userInfo, setUserInfo] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(initialUser);
  const [imagePreview, setImagePreview] = useState(null);

  // Handle input changes - exact copy of your original logic
  const handleInputChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image upload - exact copy of your original logic
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setImagePreview(dataUrl);
      setTempData((prev) => ({ ...prev, profileImageUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  // Save functionality - exact copy of your original logic
  const handleSave = () => {
    // persist preview if available
    setUserInfo((prev) => ({
      ...tempData,
      profileImageUrl:
        imagePreview ?? tempData.profileImageUrl ?? prev.profileImageUrl,
    }));
    setIsEditing(false);
    setImagePreview(null);

    // Call parent save function if provided (for future backend integration)
    if (onSave) {
      onSave({
        ...tempData,
        profileImageUrl: imagePreview ?? tempData.profileImageUrl,
      });
    }

    // Console log for testing - same as your original
    console.log("Saving user data:", {
      ...tempData,
      profileImageUrl: imagePreview ?? tempData.profileImageUrl,
    });
  };

  // Cancel functionality - exact copy of your original logic
  const handleCancel = () => {
    setTempData(userInfo);
    setIsEditing(false);
    setImagePreview(null);
  };

  // Edit mode toggle - exact copy of your original logic
  const handleEdit = () => {
    setIsEditing(true);
    setTempData(userInfo);
  };

  // Image source logic - exact copy of your original logic
  const imgSrc =
    imagePreview ||
    tempData.profileImageUrl ||
    userInfo.profileImageUrl ||
    "/api/placeholder/300/300";

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>My Profile</h2>
          {!isEditing && (
            <button className="edit-btn" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-content">
          {/* Profile Image Section - exactly matching your structure */}
          <div className="profile-image-section">
            <div className="profile-image-container">
              <img src={imgSrc} alt="Profile" className="profile-image" />
            </div>

            {/* Upload button BELOW the circle - exactly like your original */}
            {isEditing && (
              <div className="image-upload-below">
                <input
                  type="file"
                  id="profileImage"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="image-input"
                />
                <label htmlFor="profileImage" className="upload-label">
                  Change Photo
                </label>
              </div>
            )}
          </div>

          {/* User Info Section - exactly matching your structure */}
          <div className="profile-info-section">
            <div className="info-field">
              <label>Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={tempData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="info-input"
                />
              ) : (
                <p className="info-value">{userInfo.name}</p>
              )}
            </div>

            <div className="info-field">
              <label>Email</label>
              {isEditing ? (
                <input
                  type="email"
                  value={tempData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="info-input"
                />
              ) : (
                <p className="info-value">{userInfo.email}</p>
              )}
            </div>

            <div className="info-field">
              <label>Bio</label>
              {isEditing ? (
                <textarea
                  value={tempData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="bio-textarea"
                  rows="4"
                  placeholder="Tell us about your reading preferences..."
                />
              ) : (
                <p className="info-value bio-text">{userInfo.bio}</p>
              )}
            </div>
          </div>

          {/* Reading Stats - exactly matching your structure */}
          <div className="reading-stats">
            <h3>My Reading Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">42</span>
                <span className="stat-label">Books Read</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">15</span>
                <span className="stat-label">Currently Reading</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">128</span>
                <span className="stat-label">Want to Read</span>
              </div>
            </div>
          </div>

          {/* Action Buttons - exactly matching your structure */}
          {isEditing && (
            <div className="action-buttons">
              <button className="save-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
