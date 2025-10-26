import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Heart,
  MapPin,
  Calendar,
  Book,
  Star,
  Users,
  UserPlus,
  Settings,
  Save,
  X,
} from "lucide-react";
import BookModal from "../model/BookModal";
import { createReview } from "../../services/reviewsService";

const ProfileForm = ({ userData = null, onSave = null }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("want-to-read");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [favorites, setFavorites] = useState(new Set());
  const [selectedBookId, setSelectedBookId] = useState(null);

  // Review state for each book
  const [reviewData, setReviewData] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    profileImageUrl: "",
  });

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

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!userId) return;
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:5050/api/favorites/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(new Set(response.data.map((fav) => fav.googleBookId)));
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    fetchFavorites();
  }, [userId]);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const [toReadRes, collectionsRes] = await Promise.all([
          axios.get(`http://localhost:5050/api/to-read/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`http://localhost:5050/api/collections/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const toReadBooks = (toReadRes.data.books || []).map((book) => ({
          ...book,
          status: "want-to-read",
        }));

        const collectionBooks = collectionsRes.data.books || [];

        setBooks([...toReadBooks, ...collectionBooks]);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [userId]);

  const handleRemove = async (googleBookId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");

      if (currentStatus === "want-to-read") {
        await axios.delete(
          `http://localhost:5050/api/to-read/${userId}/${googleBookId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.delete(
          `http://localhost:5050/api/collections/${userId}/${googleBookId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setBooks((prev) =>
        prev.filter((book) => book.googleBookId !== googleBookId)
      );

      window.dispatchEvent(new Event("notifications:refresh"));

      alert("Book removed");
    } catch (error) {
      console.error("Error removing book:", error);
      alert("Failed to remove book");
    }
  };

  const handleStatusChange = async (googleBookId, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return;

    try {
      const token = localStorage.getItem("token");

      if (currentStatus === "want-to-read") {
        await axios.post(
          `http://localhost:5050/api/to-read/${userId}/${googleBookId}/move`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.patch(
          `http://localhost:5050/api/collections/${userId}/${googleBookId}`,
          { status: newStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setBooks((prev) =>
        prev.map((book) =>
          book.googleBookId === googleBookId
            ? { ...book, status: newStatus }
            : book
        )
      );

      window.dispatchEvent(new Event("notifications:refresh"));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

  const handleToggleFavorite = useCallback((googleBookId, e) => {
    if (e) e.stopPropagation();
    setSelectedBookId(googleBookId);
  }, []);

  const handleCategoryJoin = async (categoryKey) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5050/api/groups/${encodeURIComponent(
          categoryKey
        )}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: categoryKey }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join group");
      }

      const data = await response.json();

      if (data.alreadyMember) {
        alert(`You are already a member of ${categoryKey}`);
      } else {
        alert(`Successfully joined ${categoryKey} group!`);
      }

      window.dispatchEvent(new Event("notifications:refresh"));
    } catch (error) {
      console.error("Error joining group:", error);
      alert(error.message || "Failed to join group");
    }
  };

  // Handle review submission - FIXED VERSION
  const handleSubmitReview = async (googleBookId) => {
    const review = reviewData[googleBookId];
    
    if (!review || !review.rating) {
      alert("Please select a rating");
      return;
    }

    if (!review.comment || !review.comment.trim()) {
      alert("Please write a review");
      return;
    }

    try {
      // Call the API to create the review
      await createReview(userId, googleBookId, review.rating, review.comment.trim());
      
      // Update the state to mark as submitted
      setReviewData((prev) => ({
        ...prev,
        [googleBookId]: { 
          rating: review.rating, 
          comment: review.comment,
          submitted: true  // This flag triggers the success UI
        }
      }));

      // Show success message
      alert("Review submitted successfully!");
      
      // Optional: Refresh notifications
      window.dispatchEvent(new Event("notifications:refresh"));
      
      // DEBUG: Log to console
      console.log("Review submitted for book:", googleBookId);
      console.log("Updated reviewData:", { [googleBookId]: { rating: review.rating, comment: review.comment, submitted: true }});
      
    } catch (error) {
      console.error("Error submitting review:", error);
      
      // Check if this is a duplicate review error
      if (error.includes && error.includes("already reviewed")) {
        // If already reviewed, still mark as submitted to show the success box
        setReviewData((prev) => ({
          ...prev,
          [googleBookId]: { 
            rating: review.rating, 
            comment: review.comment,
            submitted: true
          }
        }));
        alert("You have already reviewed this book");
      } else {
        alert(error || "Failed to submit review");
      }
    }
  };

  // Update review data - memoized to prevent re-renders
  const updateReviewData = useCallback((googleBookId, field, value) => {
    setReviewData((prev) => ({
      ...prev,
      [googleBookId]: {
        ...(prev[googleBookId] || { rating: 0, comment: "", submitted: false }),
        [field]: value
      }
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("No authentication token found");
        return;
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
        setIsEditing(false);

        if (onSave) {
          onSave(formData);
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

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

  return (
    <div className="max-w-6xl mx-auto">
      {/* Profile Header Section */}
      <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-8 mb-8 shadow-sm border border-orange-100">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Name"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Location"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Bio"
                  rows="3"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
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
                    <h1 className="text-3xl font-bold text-gray-900">
                      {formData.name || "Anonymous User"}
                    </h1>
                    {formData.location && (
                      <p className="flex items-center gap-1 text-gray-600 mt-1">
                        <MapPin className="h-4 w-4" />
                        {formData.location}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                    Edit Profile
                  </button>
                </div>

                {formData.bio && (
                  <p className="text-gray-700 leading-relaxed">
                    {formData.bio}
                  </p>
                )}

                <div className="flex gap-6 pt-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Book className="h-5 w-5 text-orange-500" />
                    <span className="font-semibold text-gray-900">
                      {books.length}
                    </span>
                    <span>Books</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Heart className="h-5 w-5 text-red-500" />
                    <span className="font-semibold text-gray-900">
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

      {/* Books Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("want-to-read")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "want-to-read"
                ? "border-orange-500 text-orange-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Want to Read ({books.filter((b) => b.status === "want-to-read").length})
          </button>
          <button
            onClick={() => setActiveTab("currently-reading")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "currently-reading"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Currently Reading ({books.filter((b) => b.status === "currently-reading").length})
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-3 font-medium transition-colors border-b-2 ${
              activeTab === "completed"
                ? "border-green-500 text-green-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            Completed ({books.filter((b) => b.status === "completed").length})
          </button>
        </div>

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading books...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No books in this category yet
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard 
                key={book.googleBookId} 
                book={book}
                reviewData={reviewData[book.googleBookId] || { rating: 0, comment: "", submitted: false }}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onStatusChange={handleStatusChange}
                onRemove={handleRemove}
                onCategoryJoin={handleCategoryJoin}
                onUpdateReview={updateReviewData}
                onSubmitReview={handleSubmitReview}
              />
            ))}
          </div>
        )}
      </div>

      {/* Book Details Modal */}
      {selectedBookId && (
        <BookModal
          googleBookId={selectedBookId}
          onClose={() => setSelectedBookId(null)}
        />
      )}
    </div>
  );
};

// BookCard component - moved outside and memoized
const BookCard = React.memo(({ 
  book, 
  reviewData, 
  favorites,
  onToggleFavorite,
  onStatusChange,
  onRemove,
  onCategoryJoin,
  onUpdateReview,
  onSubmitReview
}) => {
  const isCompleted = book.status === "completed";

  // DEBUG: Log reviewData to console
  console.log(`BookCard for ${book.title}:`, { 
    googleBookId: book.googleBookId, 
    reviewData,
    submitted: reviewData.submitted 
  });

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all">
      <div className="aspect-[2/3] bg-gradient-to-br from-amber-50 to-orange-100 relative overflow-hidden flex items-center justify-center p-4">
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="font-serif text-lg text-center text-gray-800 font-semibold leading-tight">
            {book.title}
          </span>
        )}
        <span
          className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-medium ${
            book.status === "completed"
              ? "bg-teal-600 text-white"
              : book.status === "currently-reading"
              ? "bg-blue-600 text-white"
              : "bg-teal-600 text-white"
          }`}
        >
          {book.status === "want-to-read"
            ? "Want to Read"
            : book.status === "currently-reading"
            ? "Reading"
            : "Completed"}
        </span>

        {/* Heart/Favorite Button */}
        <button
          onClick={(e) => onToggleFavorite(book.googleBookId, e)}
          className={`absolute top-2 right-2 p-2 rounded-full ${
            favorites.has(book.googleBookId)
              ? 'bg-red-100 text-red-600'
              : 'bg-white/80 text-gray-400'
          } hover:scale-110 transition-all`}
        >
          <Heart
            className={`h-5 w-5 ${
              favorites.has(book.googleBookId) ? 'fill-current' : ''
            }`}
          />
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-serif font-semibold line-clamp-2 mb-1 text-gray-900">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-3">
          {(book.authors || []).join(", ")}
        </p>

        <div className="flex gap-2 mb-3">
          {book.status === "want-to-read" && (
            <>
              <button
                onClick={() => onStatusChange(book.googleBookId, "want-to-read", "currently-reading")}
                className="flex-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Start
              </button>
              <button
                onClick={() => onStatusChange(book.googleBookId, "want-to-read", "completed")}
                className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Finish
              </button>
            </>
          )}

          {book.status === "currently-reading" && (
            <select
              value={book.status}
              onChange={(e) => onStatusChange(book.googleBookId, book.status, e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="currently-reading">Currently Reading</option>
              <option value="completed">Completed</option>
            </select>
          )}

          {book.status === "completed" && (
            <select
              value={book.status}
              onChange={(e) => onStatusChange(book.googleBookId, book.status, e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="completed">Completed</option>
            </select>
          )}

          <button
            onClick={() => onRemove(book.googleBookId, book.status)}
            className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Remove
          </button>
        </div>

        {book.categories && book.categories.length > 0 && (
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Book className="h-3 w-3" />
              <span>Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {book.categories.slice(0, 3).map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => onCategoryJoin(cat)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full hover:bg-yellow-200 transition-colors"
                >
                  <Book className="h-3 w-3" />
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Review Section for Completed Books - FIXED VERSION */}
        {isCompleted && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {reviewData && reviewData.submitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-green-600 font-semibold">✓ Review Submitted</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-gray-700">Rating:</span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= (reviewData.rating || 0)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({reviewData.rating || 0}/5)</span>
                </div>
                {reviewData.comment && (
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">Review:</span>
                    <p className="mt-1 italic">"{reviewData.comment}"</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating:
                  </label>
                  <select
                    value={reviewData?.rating || 0}
                    onChange={(e) => onUpdateReview(book.googleBookId, 'rating', parseInt(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value={0}>Select</option>
                    <option value={1}>1 stars</option>
                    <option value={2}>2 stars</option>
                    <option value={3}>3 stars</option>
                    <option value={4}>4 stars</option>
                    <option value={5}>5 stars</option>
                  </select>
                </div>

                <div className="mb-3">
                  <textarea
                    value={reviewData?.comment || ""}
                    onChange={(e) => onUpdateReview(book.googleBookId, 'comment', e.target.value)}
                    placeholder="Write your review..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    rows={3}
                  />
                </div>

                <button
                  onClick={() => onSubmitReview(book.googleBookId)}
                  className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
                >
                  Submit Review
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

export default ProfileForm;