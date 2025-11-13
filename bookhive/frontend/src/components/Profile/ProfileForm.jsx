import React, { useState } from "react";
import BookModal from "../model/BookModal";
import Logout from "../logout/Logout";

// Custom hooks
import { useProfile } from "../../hooks/profile/useProfile";
import { useFavorites } from "../../hooks/profile/useFavorites";
import { useBooks } from "../../hooks/profile/useBooks";
import { useReviews } from "../../hooks/profile/useReviews";

// UI Components
import ProfileHeader from "./components/ProfileHeader";
import BooksTabs from "./components/BooksTabs";
import BooksGrid from "./components/BooksGrid";
import BookCard from "./components/BookCard";

/**
 * ProfileForm Component (Refactored)
 * Orchestrates profile management using custom hooks and focused components
 */
const ProfileForm = ({ userData = null, onSave = null }) => {
  // UI state
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("want-to-read");
  const [selectedBookId, setSelectedBookId] = useState(null);

  // Custom hooks for data management
  const {
    userId,
    formData,
    uploadingImage,
    handleInputChange,
    handleImageUpload,
    handleSave,
  } = useProfile();

  const { favorites, handleToggleFavorite } = useFavorites(userId);

  const {
    books,
    loading,
    handleRemove,
    handleStatusChange,
    handleCategoryJoin,
  } = useBooks(userId);

  const { reviewData, updateReviewData, handleSubmitReview } = useReviews(userId);

  // Handle save with edit mode toggle
  const handleSaveProfile = async () => {
    const success = await handleSave(onSave);
    if (success) {
      setIsEditing(false);
    }
  };

  // Handle favorite toggle (opens modal)
  const handleFavoriteClick = (googleBookId, e) => {
    const bookId = handleToggleFavorite(googleBookId, e);
    setSelectedBookId(bookId);
  };

  // Filter books based on active tab
  const filteredBooks = books.filter((book) => {
    if (activeTab === "want-to-read") {
      return book.status === "want-to-read";
    } else if (activeTab === "currently-reading") {
      return book.status === "currently-reading";
    } else if (activeTab === "completed") {
      return book.status === "completed";
    }
    return false;
  });

  // Calculate book counts for tabs
  const bookCounts = {
    wantToRead: books.filter((b) => b.status === "want-to-read").length,
    currentlyReading: books.filter((b) => b.status === "currently-reading").length,
    completed: books.filter((b) => b.status === "completed").length,
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header Section */}
      <ProfileHeader
        formData={formData}
        isEditing={isEditing}
        uploadingImage={uploadingImage}
        favorites={favorites}
        booksCount={books.length}
        onEdit={() => setIsEditing(true)}
        onSave={handleSaveProfile}
        onCancel={() => setIsEditing(false)}
        onInputChange={handleInputChange}
        onImageUpload={handleImageUpload}
      />

      {/* Books Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {/* Tabs */}
        <BooksTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          bookCounts={bookCounts}
        />

        {/* Books Grid */}
        <BooksGrid books={filteredBooks} loading={loading}>
          {filteredBooks.map((book) => (
            <BookCard
              key={book.googleBookId}
              book={book}
              reviewData={reviewData[book.googleBookId] || { rating: 0, comment: "", submitted: false }}
              favorites={favorites}
              onToggleFavorite={handleFavoriteClick}
              onStatusChange={handleStatusChange}
              onRemove={handleRemove}
              onCategoryJoin={handleCategoryJoin}
              onUpdateReview={updateReviewData}
              onSubmitReview={handleSubmitReview}
            />
          ))}
        </BooksGrid>
      </div>

      {/* Book Details Modal */}
      {selectedBookId && (
        <BookModal
          googleBookId={selectedBookId}
          onClose={() => setSelectedBookId(null)}
        />
      )}

      {/* Logout Button */}
      <div className="flex justify-center mt-8 mb-4">
        <Logout />
      </div>
    </div>
  );
};

export default ProfileForm;