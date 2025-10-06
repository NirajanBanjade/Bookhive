import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Book,
  Star,
  Users,
  UserPlus,
  Settings,
} from "lucide-react";

const ProfileForm = ({ userData = null, onSave = null }) => {
  const [activeTab, setActiveTab] = useState("currently-reading");

  // Default user data
  const defaultUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    bio: "Avid reader and book enthusiast. Love fantasy, sci-fi, and mystery novels.",
    profileImageUrl: null,
    location: "San Francisco, CA",
    joinDate: "March 2024",
  };

  const initialUser = userData || defaultUser;

  const [userInfo, setUserInfo] = useState(initialUser);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState(initialUser);
  const [imagePreview, setImagePreview] = useState(null);

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image upload
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

  // Save functionality
  const handleSave = () => {
    setUserInfo((prev) => ({
      ...tempData,
      profileImageUrl:
        imagePreview ?? tempData.profileImageUrl ?? prev.profileImageUrl,
    }));
    setIsEditing(false);
    setImagePreview(null);

    if (onSave) {
      onSave({
        ...tempData,
        profileImageUrl: imagePreview ?? tempData.profileImageUrl,
      });
    }

    console.log("Saving user data:", {
      ...tempData,
      profileImageUrl: imagePreview ?? tempData.profileImageUrl,
    });
  };

  // Cancel functionality
  const handleCancel = () => {
    setTempData(userInfo);
    setIsEditing(false);
    setImagePreview(null);
  };

  // Stats (set to 0)
  const stats = [
    { label: "Books Read", value: "0", icon: Book },
    { label: "Reviews", value: "0", icon: Star },
    { label: "Followers", value: "0", icon: Users },
    { label: "Following", value: "0", icon: UserPlus },
  ];

  const imgSrc =
    imagePreview || tempData.profileImageUrl || userInfo.profileImageUrl;

  // Mock books
  const currentlyReading = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      genre: "Fiction",
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-Help",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="relative">
              <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg bg-orange-500 flex items-center justify-center">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={userInfo.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-4xl font-serif font-bold text-white">
                    {getInitials(userInfo.name)}
                  </span>
                )}
              </div>
              {isEditing && (
                <div className="mt-3">
                  <input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="profileImage"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                  >
                    Change Photo
                  </label>
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Name - NOT editable like GitHub */}
                  <h1 className="font-serif text-3xl font-bold mb-2 text-gray-900">
                    {userInfo.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {userInfo.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {userInfo.joinDate}
                    </span>
                  </div>
                </div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                  >
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </button>
                ) : null}
              </div>

              {/* Bio - Editable */}
              {isEditing ? (
                <textarea
                  value={tempData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 text-gray-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  rows="3"
                  placeholder="Tell us about your reading preferences..."
                />
              ) : (
                <p className="text-gray-700 mb-6 max-w-2xl leading-relaxed">
                  {userInfo.bio}
                </p>
              )}

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-3 mb-6">
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow"
                  >
                    <stat.icon className="h-5 w-5 mx-auto mb-2 text-orange-500" />
                    <div className="text-2xl font-bold font-serif text-gray-900">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bookshelves - Same as ProfileView */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 p-1 bg-white">
            <button
              onClick={() => setActiveTab("currently-reading")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "currently-reading"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Currently Reading
            </button>
            <button
              onClick={() => setActiveTab("want-to-read")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "want-to-read"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Want to Read
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === "completed"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="text-center text-gray-500 py-12">
          <p>Your book collection will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;
