import React from "react";
import "./Profile.css";

// ProfileView Component - Displays user profile in read-only mode
// Used when viewing other people's profiles (no edit functionality)
const ProfileView = ({ userData = null }) => {
  // Default demo data - will be replaced with real user data from props
  const defaultUser = {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    bio: "Book lover and fantasy enthusiast. Currently reading The Lord of the Rings series.",
    profileImageUrl: null,
  };

  const user = userData || defaultUser;

  // Display logic for profile image - same as your current code
  const imgSrc = user.profileImageUrl || "/api/placeholder/300/300";

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <h2>Profile</h2>
          {/* No edit button in view-only mode */}
        </div>

        <div className="profile-content">
          {/* Profile Image Section - View Only */}
          <div className="profile-image-section">
            <div className="profile-image-container">
              <img src={imgSrc} alt="Profile" className="profile-image" />
            </div>
            {/* No upload button in view mode */}
          </div>

          {/* User Info Section - Display Only */}
          <div className="profile-info-section">
            <div className="info-field">
              <label>Name</label>
              <p className="info-value">{user.name}</p>
            </div>

            <div className="info-field">
              <label>Email</label>
              <p className="info-value">{user.email}</p>
            </div>

            <div className="info-field">
              <label>Bio</label>
              <p className="info-value bio-text">{user.bio}</p>
            </div>
          </div>

          {/* Reading Stats - Static display */}
          <div className="reading-stats">
            <h3>Reading Stats</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">35</span>
                <span className="stat-label">Books Read</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">8</span>
                <span className="stat-label">Currently Reading</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">92</span>
                <span className="stat-label">Want to Read</span>
              </div>
            </div>
          </div>

          {/* No action buttons in view-only mode */}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
