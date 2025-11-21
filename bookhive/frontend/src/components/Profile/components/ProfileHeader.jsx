import React from "react";
import { MapPin, Book, Heart, Settings, Save, X, Camera } from "lucide-react";
/**
 * ProfileHeader Component
 * Displays user profile information with edit mode
 */
const ProfileHeader = ({
  formData,
  isEditing,
  uploadingImage,
  favorites,
  booksCount,
  onEdit,
  onSave,
  onCancel,
  onInputChange,
  onImageUpload,
}) => {
  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-600 to-gray-700 rounded-2xl p-8 mb-8 shadow-2xl border border-amber-500/20">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        {/* Profile Image */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-amber-300 to-orange-300 flex items-center justify-center text-white text-xl font-bold shadow-lg overflow-hidden ring-4 ring-amber-500/30">
            {formData.profileImageUrl ? (
              <img
                src={`http://localhost:5050${formData.profileImageUrl}`}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : formData.name ? (
              formData.name.charAt(0).toUpperCase()
            ) : (
              "U"
            )}
          </div>
          {isEditing && (
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 bg-amber-500 text-white rounded-full p-4 cursor-pointer hover:bg-amber-300 transition-colors shadow-lg"
              title="Change profile picture"
            >
              {uploadingImage ? (
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                <Camera className="h-5 w-5" />
              )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
                disabled={uploadingImage}
              />
            </label>
          )}
        </div>
        {/* Profile Info */}
        <div className="flex-1 space-y-4">
          {isEditing ? (
            <div className="space-y-3">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder="Name"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={onInputChange}
                placeholder="Location"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <textarea
                name="bio"
                value={formData.bio}
                onChange={onInputChange}
                placeholder="Bio"
                rows="3"
                className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-400 transition-colors shadow-lg"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
                <button
                  onClick={onCancel}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {formData.name || "Anonymous User"}
                  </h1>
                  {formData.location && (
                    <p className="flex items-center gap-1 text-amber-400 mt-1">
                      <MapPin className="h-4 w-4" />
                      {formData.location}
                    </p>
                  )}
                </div>
                <button
                  onClick={onEdit}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-amber-500 text-amber-400 rounded-lg hover:bg-gray-700 hover:border-amber-400 transition-colors"
                >
                  <Settings className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>
              {formData.bio && (
                <p className="text-gray-300 leading-relaxed">{formData.bio}</p>
              )}
              <div className="flex gap-6 pt-2">
                <div className="flex items-center gap-2 text-gray-100">
                  <Book className="h-5 w-5 text-amber-500" />
                  <span className="font-semibold text-white">{booksCount}</span>
                  <span>Books</span>
                </div>
                <div className="flex items-center gap-2 text-gray-100">
                  <Heart className="h-5 w-5 text-red-500" />
                  <span className="font-semibold text-white">
                    {favorites.size}
                  </span>
                  <span>Favorites</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProfileHeader;
