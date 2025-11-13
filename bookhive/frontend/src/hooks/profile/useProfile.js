import { useState, useEffect } from "react";
import axios from "axios";

/**
 * Custom hook for managing user profile data
 * Handles fetching current user, updating profile, and image uploads
 */
export const useProfile = () => {
  const [userId, setUserId] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    profileImageUrl: "",
  });

  // Fetch current user on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get("http://localhost:5050/api/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data;
        setUserId(user._id || user.id);
        setFormData({
          name: user.username || user.name || "",
          email: user.email || "",
          bio: user.bio || "",
          location: user.location || "",
          profileImageUrl: user.profileImageUrl || "",
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload an image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    try {
      setUploadingImage(true);
      const token = localStorage.getItem('token');

      const formDataUpload = new FormData();
      formDataUpload.append('avatar', file);

      const response = await axios.post(
        'http://localhost:5050/api/user/upload-avatar',
        formDataUpload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Update the formData state with the new image URL
      setFormData((prev) => ({
        ...prev,
        profileImageUrl: response.data.profileImageUrl,
      }));

      alert('Profile picture updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle form data changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save profile updates
  const handleSave = async (onSaveCallback = null) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No authentication token found");
        return false;
      }

      const response = await axios.put(
        "http://localhost:5050/api/user/profile",
        {
          username: formData.name,
          bio: formData.bio,
          location: formData.location,
          profileImageUrl: formData.profileImageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!");
        
        if (onSaveCallback) {
          onSaveCallback(formData);
        }
        
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
      return false;
    }
  };

  return {
    userId,
    formData,
    uploadingImage,
    setFormData,
    handleInputChange,
    handleImageUpload,
    handleSave,
  };
};