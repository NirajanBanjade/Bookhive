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

  const { 
    favorites, 
    favoriteBooks, 
    loading: favoritesLoading, 
    toggleFavorite 
  } = useFavorites(userId);

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

  // Handle favorite toggle - actually add/remove from favorites
  const handleFavoriteClick = async (googleBookId, e) => {
    if (e) e.stopPropagation();
    
    // Find the book data (could be in books or favoriteBooks)
    let book = books.find(b => b.googleBookId === googleBookId);
    if (!book) {
      book = favoriteBooks.find(b => b.googleBookId === googleBookId);
    }
    
    if (!book) {
      console.error('Book not found for favorite toggle:', googleBookId);
      return;
    }

    try {
      await toggleFavorite({
        googleBookId: book.googleBookId,
        title: book.title,
        authors: book.authors || [],
        thumbnail: book.thumbnail || null,
        categories: book.categories || []
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites. Please try again.');
    }
  };

  // Handle remove - different logic for Favorites tab vs status tabs
  const handleRemoveBook = async (googleBookId, currentStatus) => {
    if (activeTab === "favorites") {
      // In Favorites tab, "Remove" means unfavorite
      await handleFavoriteClick(googleBookId, null);
    } else {
      // In other tabs, use the normal remove logic
      await handleRemove(googleBookId, currentStatus);
    }
  };

  // Filter books based on active tab
  const filteredBooks = activeTab === "favorites" 
    ? favoriteBooks  // Show favorite books from separate array
    : books.filter((book) => {
        if (activeTab === "want-to-read") {
          return book.status === "want-to-read";
        } else if (activeTab === "currently-reading") {
          return book.status === "currently-reading";
        } else if (activeTab === "re-reading") {
          return book.status === "re-reading";
        } else if (activeTab === "completed") {
          return book.status === "completed";
        }
        return false;
      });

  // Calculate book counts for tabs
  const bookCounts = {
    wantToRead: books.filter((b) => b.status === "want-to-read").length,
    currentlyReading: books.filter((b) => b.status === "currently-reading").length,
    reReading: books.filter((b) => b.status === "re-reading").length,
    completed: books.filter((b) => b.status === "completed").length,
    favorites: favoriteBooks.length,
  };

  // Determine loading state based on active tab
  const isLoading = activeTab === "favorites" ? favoritesLoading : loading;

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
        <BooksGrid books={filteredBooks} loading={isLoading}>
          {filteredBooks.map((book) => (
            <BookCard
              key={book.googleBookId}
              book={book}
              reviewData={reviewData[book.googleBookId] || { rating: 0, comment: "", submitted: false }}
              favorites={favorites}
              onToggleFavorite={handleFavoriteClick}
              onStatusChange={handleStatusChange}
              onRemove={handleRemoveBook}
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