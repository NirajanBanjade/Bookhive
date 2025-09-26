import React from "react";
import ProfileView from "./ProfileView";
import ProfileForm from "./ProfileForm";

// Main Profile Component - Smart controller that decides which component to render
// This is the main entry point that your team will use
// Props:
//   - isOwnProfile: true = show editable form, false = show read-only view
//   - userData: user data object to display
//   - onSave: callback function when user saves changes
const Profile = ({
  isOwnProfile = true, // Default to showing your own profile (editable)
  userData = null, // User data to display
  onSave = null, // Save callback for parent components
}) => {
  // Simple logic: show editable form for your own profile, read-only for others
  if (isOwnProfile) {
    // User viewing their own profile - show full editing capabilities
    return <ProfileForm userData={userData} onSave={onSave} />;
  } else {
    // User viewing someone else's profile - show read-only view
    return <ProfileView userData={userData} />;
  }
};

export default Profile;
