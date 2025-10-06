import React, { useState } from "react";
import {
  MapPin,
  Calendar,
  Book,
  Star,
  Users,
  UserPlus,
  Heart,
} from "lucide-react";

const ProfileView = ({ userData = null }) => {
  const [activeTab, setActiveTab] = useState("currently-reading");

  // Default user data
  const defaultUser = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    bio: "Avid reader with a passion for literary fiction, historical narratives, and the occasional thriller. Always looking for my next favorite book! 📚",
    profileImageUrl: null,
    location: "San Francisco, CA",
    joinDate: "March 2024",
  };

  const user = userData || defaultUser;

  // Get initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Mock stats (set to 0 as requested)
  const stats = [
    { label: "Books Read", value: "0", icon: Book },
    { label: "Reviews", value: "0", icon: Star },
    { label: "Followers", value: "0", icon: Users },
    { label: "Following", value: "0", icon: UserPlus },
  ];

  // Mock book data - replace with actual API data later
  const currentlyReading = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      genre: "Fiction",
      progress: 67,
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-Help",
      progress: 34,
    },
  ];

  const wantToRead = [
    {
      id: 3,
      title: "Tomorrow, and Tomorrow, and Tomorrow",
      author: "Gabrielle Zevin",
      genre: "Fiction",
    },
    {
      id: 4,
      title: "The Thursday Murder Club",
      author: "Richard Osman",
      genre: "Mystery",
    },
  ];

  const completed = [
    {
      id: 5,
      title: "The Song of Achilles",
      author: "Madeline Miller",
      genre: "Fiction",
      rating: 5,
    },
    {
      id: 6,
      title: "Educated",
      author: "Tara Westover",
      genre: "Memoir",
      rating: 4.5,
    },
  ];

  const BookCard = ({ book, status }) => (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all group cursor-pointer">
      <div className="aspect-[2/3] bg-gradient-to-br from-amber-50 to-orange-100 relative overflow-hidden flex items-center justify-center p-6">
        <span className="font-serif text-xl text-center text-gray-800 font-semibold leading-tight">
          {book.title}
        </span>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="rounded-full h-8 w-8 bg-white shadow-md flex items-center justify-center hover:bg-gray-50">
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        {status && (
          <span
            className={`absolute bottom-2 left-2 px-3 py-1 rounded-full text-xs font-medium ${
              status === "completed"
                ? "bg-orange-500 text-white"
                : "bg-teal-600 text-white"
            }`}
          >
            {status === "want-to-read"
              ? "Want to Read"
              : status === "reading"
              ? "Reading"
              : "Completed"}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif font-semibold line-clamp-2 mb-1 text-gray-900">
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        {book.genre && (
          <span className="inline-block px-3 py-1 border border-gray-200 text-gray-700 text-xs rounded-full">
            {book.genre}
          </span>
        )}
        {book.rating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < book.rating
                    ? "fill-orange-400 text-orange-400"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="text-xs text-gray-600 ml-1">
              {book.rating.toFixed(1)}
            </span>
          </div>
        )}
        {book.progress !== undefined && (
          <div className="mt-3">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all"
                style={{ width: `${book.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {book.progress}% complete
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="h-32 w-32 rounded-full border-4 border-white shadow-lg bg-orange-500 flex items-center justify-center">
              {user.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <span className="text-4xl font-serif font-bold text-white">
                  {getInitials(user.name)}
                </span>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="font-serif text-3xl font-bold mb-2 text-gray-900">
                    {user.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {user.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {user.joinDate}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6 max-w-2xl leading-relaxed">
                {user.bio}
              </p>

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

      {/* Bookshelves */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
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

        {/* Tab Content */}
        {activeTab === "currently-reading" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentlyReading.map((book) => (
              <BookCard key={book.id} book={book} status="reading" />
            ))}
          </div>
        )}

        {activeTab === "want-to-read" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wantToRead.map((book) => (
              <BookCard key={book.id} book={book} status="want-to-read" />
            ))}
          </div>
        )}

        {activeTab === "completed" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {completed.map((book) => (
              <BookCard key={book.id} book={book} status="completed" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
