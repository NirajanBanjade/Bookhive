import React, { useState, useEffect } from "react";
import {
  MapPin,
  Calendar,
  Book,
  Star,
  Users,
  UserPlus,
  Settings,
  Heart,
} from "lucide-react";
import { getToReadBooks, addDemoBookToRead, removeBookFromToRead } from '../../services/toReadService';
import { getCollections, moveToCollections, updateBookStatus, removeFromCollections } from '../../services/collectionsService';
import { createReview } from '../../services/reviewsService';

const ProfileForm = ({ userData = null, onSave = null }) => {
  const [activeTab, setActiveTab] = useState("currently-reading");
  const [wantToReadBooks, setWantToReadBooks] = useState([]);
  const [collectionBooks, setCollectionBooks] = useState([]);
  const [reviewState, setReviewState] = useState({}); // { googleBookId: { rating, comment, loading, error, data } }
  const userId = 'user123';

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

  useEffect(() => {
    if (activeTab === 'want-to-read') {
      const fetchBooks = async () => {
        try {
          const books = await getToReadBooks(userId);
          setWantToReadBooks(books);
        } catch (err) {
          console.error('Error fetching to-read list:', err);
        }
      };
      fetchBooks();
    }
  }, [activeTab, userId]);

  useEffect(() => {
    if (activeTab === 'currently-reading' || activeTab === 'completed') {
      const fetchCollections = async () => {
        try {
          const books = await getCollections(userId);
          setCollectionBooks(books);
        } catch (err) {
          console.error('Error fetching collections:', err);
        }
      };
      fetchCollections();
    }
  }, [activeTab, userId]);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleInputChange = (field, value) => {
    setTempData((prev) => ({ ...prev, [field]: value }));
  };

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

  const handleCancel = () => {
    setTempData(userInfo);
    setIsEditing(false);
    setImagePreview(null);
  };

  const handleAddDemo = async () => {
  try {
    const updatedBooks = await addDemoBookToRead(userId);
    setWantToReadBooks(updatedBooks);
    alert('Demo book added to To-Read list');
  } catch (err) {
    console.error('Error adding book:', err);
    alert(typeof err === 'string' ? err : 'Failed to add book');
  }
};

  const handleRemove = async (googleBookId) => {
    try {
      const updatedBooks = await removeBookFromToRead(userId, googleBookId);
      setWantToReadBooks(updatedBooks);
      alert('Book removed from your To-Read list');
    } catch (err) {
      console.error('Error removing book:', err.response?.data || err);
      alert(err.response?.data?.error || 'Failed to remove book');
    }
  };

  const handleMoveToCollections = async (googleBookId, status) => {
    try {
      const response = await moveToCollections(userId, googleBookId, status);
      setWantToReadBooks(response.toRead);
      setCollectionBooks(response.collections);
      alert(`Book moved to ${status === 'currently-reading' ? 'Currently Reading' : 'Completed'}`);
    } catch (err) {
      console.error('Error moving book:', err.response?.data || err);
      alert(err.response?.data?.error || 'Failed to move book');
    }
  };

  const handleUpdateStatus = async (googleBookId, newStatus) => {
    try {
      const updatedBooks = await updateBookStatus(userId, googleBookId, newStatus);
      setCollectionBooks(updatedBooks);
      alert(`Book status updated to ${newStatus === 'currently-reading' ? 'Currently Reading' : 'Completed'}`);
    } catch (err) {
      console.error('Error updating book status:', err.response?.data || err);
      alert(err.response?.data?.error || 'Failed to update book status');
    }
  };

  const handleRemoveFromCollections = async (googleBookId) => {
    try {
      const updatedBooks = await removeFromCollections(userId, googleBookId);
      setCollectionBooks(updatedBooks);
      alert('Book removed from your collection');
    } catch (err) {
      console.error('Error removing book from collection:', err.response?.data || err);
      alert(err.response?.data?.error || 'Failed to remove book');
    }
  };

  const ReviewForm = ({ book }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Comment cannot be empty');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Rating must be 1-5');
      return;
    }
    setError('');
    setLoading(true);

    const optimistic = {
      _id: `temp-${Date.now()}`,
      userId,
      googleBookId: book.googleBookId,
      rating,
      comment,
      reviewedAt: new Date().toISOString(),
    };
    setData(optimistic);

    try {
      const saved = await createReview(userId, book.googleBookId, rating, comment);
      setData(saved);
      setIsSubmitted(true);
    } catch (err) {
      setData(null);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
      {isSubmitted ? (
        <div className="p-3 bg-green-50 border border-green-200 rounded text-sm">
          <p className="text-green-800 font-medium">Review submitted!</p>
          <p className="text-green-700">
            <strong>{rating} stars</strong> – {comment}
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value={0}>Select</option>
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} stars</option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded resize-none text-sm"
            rows={3}
          />

          {error && <p className="text-red-600 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="px-3 py-1 bg-orange-500 text-white rounded text-sm hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Submit Review'}
          </button>
        </form>
      )}

      {data && !isSubmitted && (
        <div className="mt-3 p-3 bg-white rounded border text-sm">
          <p>
            <strong>{data.rating} stars</strong> – {data.comment}
          </p>
          <p className="text-xs text-gray-500">
            {new Date(data.reviewedAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

  const booksReadCount = collectionBooks.filter(book => book.status === 'completed').length;

  const stats = [
    { label: "Books Read", value: booksReadCount.toString(), icon: Book },
    { label: "Reviews", value: "0", icon: Star },
    { label: "Followers", value: "0", icon: Users },
    { label: "Following", value: "0", icon: UserPlus },
  ];

  const imgSrc =
    imagePreview || tempData.profileImageUrl || userInfo.profileImageUrl;

  const BookCard = ({ book }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group cursor-pointer">
      <div className="aspect-[2/3] bg-gradient-to-br from-amber-50 to-orange-100 relative overflow-hidden flex items-center justify-center p-6">
        {book.thumbnail ? (
          <img src={book.thumbnail} alt={book.title} className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="font-serif text-xl text-center text-gray-800 font-semibold leading-tight">
            {book.title}
          </span>
        )}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="rounded-full h-8 w-8 bg-white shadow-md flex items-center justify-center hover:bg-gray-50">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        <span className="absolute bottom-2 left-2 px-3 py-1 rounded-full text-xs font-medium bg-teal-600 text-white">
          {activeTab === 'want-to-read' ? 'Want to Read' : book.status === 'currently-reading' ? 'Currently Reading' : 'Completed'}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-serif font-semibold line-clamp-2 mb-1 text-gray-900">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{book.authors?.join(', ')}</p>
        <div className="mt-2 flex justify-between">
          {activeTab === 'want-to-read' ? (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(book.googleBookId);
                }}
                className="text-xs px-2 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
              <div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveToCollections(book.googleBookId, 'currently-reading');
                  }}
                  className="text-xs px-2 py-1 bg-green-500 text-white rounded mr-1"
                >
                  Start
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMoveToCollections(book.googleBookId, 'completed');
                  }}
                  className="text-xs px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Finish
                </button>
              </div>
            </>
          ) : (
            <>
              <select
                value={book.status}
                onChange={(e) => {
                  e.stopPropagation();
                  handleUpdateStatus(book.googleBookId, e.target.value);
                }}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="currently-reading">Currently Reading</option>
                <option value="completed">Completed</option>
              </select>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFromCollections(book.googleBookId);
                }}
                className="text-xs px-2 py-1 bg-red-500 text-white rounded"
              >
                Remove
              </button>
            </>
          )}
        </div>

        {activeTab === 'completed' && <ReviewForm book={book} />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
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

        <div className="py-8">
          {activeTab === 'want-to-read' ? (
            <>
              <button onClick={handleAddDemo} className="mb-6 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium">
                Add Demo Book
              </button>
              {wantToReadBooks.length === 0 ? (
                <p className="text-center text-gray-500 py-12">No books yet. Go add some!</p>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {wantToReadBooks.map((book) => (
                    <BookCard key={book.googleBookId} book={book} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {collectionBooks.length === 0 ? (
                <p className="text-center text-gray-500 py-12">No books yet in this collection.</p>
              ) : (
                collectionBooks
                  .filter(book => book.status === activeTab)
                  .map((book) => (
                    <BookCard key={book.googleBookId} book={book} />
                  ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;