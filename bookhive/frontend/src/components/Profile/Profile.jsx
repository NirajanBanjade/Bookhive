import React, { useMemo, useState } from "react";
import "./Profile.css";

const Profile = () => {
  // State for user data (note: store a URL for the image)
  const [userData, setUserData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Avid reader and book enthusiast. Love fantasy, sci-fi, and mystery novels.",
    profileImageUrl: null, // <— data URL we can render
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(userData);
  const [imagePreview, setImagePreview] = useState(null); // preview while editing

  const handleInputChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  // Upload → create a data URL we can render & save
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

  const handleSave = () => {
    // persist preview if available
    setUserData((prev) => ({
      ...tempData,
      profileImageUrl:
        imagePreview ?? tempData.profileImageUrl ?? prev.profileImageUrl,
    }));
    setIsEditing(false);
    setImagePreview(null);
    console.log("Saving user data:", {
      ...tempData,
      profileImageUrl: imagePreview ?? tempData.profileImageUrl,
    });
  };

  const handleCancel = () => {
    setTempData(userData);
    setIsEditing(false);
    setImagePreview(null);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setTempData(userData);
  };

  // Choose what to display
  const imgSrc =
    imagePreview ||
    tempData.profileImageUrl ||
    userData.profileImageUrl ||
    "/api/placeholder/300/300";

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profile</h2>
          {!isEditing && (
            <button className="edit-btn" onClick={handleEdit}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-content">
          {/* Profile Image Section */}
          <div className="profile-image-section">
            <div className="profile-image-container">
              <img src={imgSrc} alt="Profile" className="profile-image" />
            </div>

            {/* ⬇️ Button BELOW the circle (not overlayed) */}
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

          {/* User Info Section */}
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
                <p className="info-value">{userData.name}</p>
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
                <p className="info-value">{userData.email}</p>
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
                <p className="info-value bio-text">{userData.bio}</p>
              )}
            </div>
          </div>

          {/* Reading Stats (Placeholder) */}
          <div className="reading-stats">
            <h3>Reading Stats</h3>
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

export default Profile;
