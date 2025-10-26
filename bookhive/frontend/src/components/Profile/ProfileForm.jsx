import React, { useState, useEffect } from "react";
import axios from "axios";
import {
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

const ProfileForm = ({ userData = null, onSave = null }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("want-to-read");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

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

      // Trigger notification refresh
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

      // Trigger notification refresh
      window.dispatchEvent(new Event("notifications:refresh"));
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status");
    }
  };

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

      // Trigger notification refresh
      window.dispatchEvent(new Event("notifications:refresh"));
    } catch (error) {
      console.error("Error joining group:", error);
      alert(error.message || "Failed to join group");
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:5050/api/profile/${userId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsEditing(false);
      if (onSave) onSave(formData);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const stats = [
    {
      label: "Books Read",
      value: books.filter((b) => b.status === "completed").length,
      icon: Book,
    },
    { label: "Reviews", value: "0", icon: Star },
    { label: "Followers", value: "0", icon: Users },
    { label: "Following", value: "0", icon: UserPlus },
  ];

  const filteredBooks = books.filter((book) => {
    if (activeTab === "want-to-read") return book.status === "want-to-read";
    if (activeTab === "currently-reading")
      return book.status === "currently-reading";
    if (activeTab === "completed") return book.status === "completed";
    return false;
  });

  const BookCard = ({ book }) => (
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
                onClick={() =>
                  handleStatusChange(
                    book.googleBookId,
                    "want-to-read",
                    "currently-reading"
                  )
                }
                className="flex-1 px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Start
              </button>
              <button
                onClick={() =>
                  handleStatusChange(
                    book.googleBookId,
                    "want-to-read",
                    "completed"
                  )
                }
                className="flex-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Finish
              </button>
            </>
          )}

          {book.status === "currently-reading" && (
            <select
              value={book.status}
              onChange={(e) =>
                handleStatusChange(
                  book.googleBookId,
                  book.status,
                  e.target.value
                )
              }
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="currently-reading">Currently Reading</option>
              <option value="completed">Completed</option>
            </select>
          )}

          {book.status === "completed" && (
            <select
              value={book.status}
              onChange={(e) =>
                handleStatusChange(
                  book.googleBookId,
                  book.status,
                  e.target.value
                )
              }
              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="completed">Completed</option>
            </select>
          )}

          <button
            onClick={() => handleRemove(book.googleBookId, book.status)}
            className="px-4 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Remove
          </button>
        </div>

        {book.categories && book.categories.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-xs text-gray-600">
              <Book className="h-3 w-3" />
              <span>Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {book.categories.slice(0, 3).map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => handleCategoryJoin(cat)}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full hover:bg-yellow-200 transition-colors"
                >
                  <Book className="h-3 w-3" />
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg bg-orange-500 flex items-center justify-center">
              {formData.profileImageUrl ? (
                <img
                  src={formData.profileImageUrl}
                  alt={formData.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-serif font-bold text-white">
                  {getInitials(formData.name)}
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="font-serif text-3xl font-bold mb-2 text-gray-900 border-b-2 border-orange-500 focus:outline-none bg-transparent"
                    />
                  ) : (
                    <h1 className="font-serif text-3xl font-bold mb-2 text-gray-900">
                      {formData.name}
                    </h1>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="Location"
                        className="flex items-center gap-1 border-b border-gray-300 focus:outline-none focus:border-orange-500"
                      />
                    ) : (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {formData.location || "Location not set"}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined March 2024
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (isEditing) {
                      handleSaveProfile();
                    } else {
                      setIsEditing(true);
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {isEditing ? (
                    <>
                      <Save className="h-4 w-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Settings className="h-4 w-4" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              {isEditing ? (
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 mb-6"
                  rows="3"
                />
              ) : (
                <p className="text-gray-700 mb-6 max-w-2xl leading-relaxed">
                  {formData.bio ||
                    "Avid reader and book enthusiast. Love fantasy, sci-fi, and mystery novels."}
                </p>
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

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading books...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No books in this category yet.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.googleBookId} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;