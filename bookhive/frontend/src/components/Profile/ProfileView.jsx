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
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:shadow-2xl hover:border-amber-500/50 transition-all group cursor-pointer">
      <div className="aspect-[2/3] bg-gradient-to-br from-gray-700 to-gray-600 relative overflow-hidden flex items-center justify-center p-6">
        <span className="font-serif text-xl text-center text-white font-semibold leading-tight">
          {book.title}
        </span>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="rounded-full h-8 w-8 bg-gray-700 shadow-md flex items-center justify-center hover:bg-gray-600 border border-amber-500/30">
            <Heart className="h-4 w-4 text-amber-400" />
          </button>
        </div>
        {status && (
          <span
            className={`absolute bottom-2 left-2 px-3 py-1 rounded-full text-xs font-medium ${
              status === "completed"
                ? "bg-emerald-600 text-white"
                : "bg-amber-600 text-white"
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
        <h3 className="font-serif font-semibold line-clamp-2 mb-1 text-white">
          {book.title}
        </h3>
        <p className="text-sm text-gray-400 mb-2">{book.author}</p>
        {book.genre && (
          <span className="inline-block px-3 py-1 border border-amber-500/30 text-amber-400 text-xs rounded-full bg-amber-500/10">
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
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-600"
                }`}
              />
            ))}
            <span className="text-xs text-gray-400 ml-1">
              {book.rating.toFixed(1)}
            </span>
          </div>
        )}
        {book.progress !== undefined && (
          <div className="mt-3">
            <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all"
                style={{ width: `${book.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {book.progress}% complete
            </p>
          </div>
        )}
      </div>
    </div>
  );
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Avatar */}
            <div className="h-32 w-32 rounded-full border-4 border-amber-500 shadow-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center ring-4 ring-amber-500/20">
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
                  <h1 className="font-serif text-3xl font-bold mb-2 text-white">
                    {user.name}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-amber-400" />
                      {user.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-amber-400" />
                      Joined {user.joinDate}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 mb-6 max-w-2xl leading-relaxed">
                {user.bio}
              </p>
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-gray-800 rounded-xl p-4 shadow-lg border border-gray-700 text-center hover:shadow-2xl hover:border-amber-500/30 transition-all"
                  >
                    <stat.icon className="h-5 w-5 mx-auto mb-2 text-amber-500" />
                    <div className="text-2xl font-bold font-serif text-white">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bookshelves - Dark themed container */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("currently-reading")}
                  className={`flex-1 px-4 py-3 font-semibold transition-all duration-200 border-b-3 ${
                    activeTab === "currently-reading"
                      ? "border-amber-500 text-amber-400 bg-gray-700"
                      : "border-transparent text-gray-400 bg-gray-800 hover:text-amber-300 hover:bg-gray-750"
                  }`}
                >
                  Currently Reading
                </button>
                <button
                  onClick={() => setActiveTab("want-to-read")}
                  className={`flex-1 px-4 py-3 font-semibold transition-all duration-200 border-b-3 ${
                    activeTab === "want-to-read"
                      ? "border-orange-500 text-orange-400 bg-gray-700"
                      : "border-transparent text-gray-400 bg-gray-800 hover:text-orange-300 hover:bg-gray-750"
                  }`}
                >
                  Want to Read
                </button>
                <button
                  onClick={() => setActiveTab("completed")}
                  className={`flex-1 px-4 py-3 font-semibold transition-all duration-200 border-b-3 ${
                    activeTab === "completed"
                      ? "border-emerald-500 text-emerald-400 bg-gray-700"
                      : "border-transparent text-gray-400 bg-gray-800 hover:text-emerald-300 hover:bg-gray-750"
                  }`}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
          {/* Tab Content with dark background */}
          <div className="bg-gray-900/50 rounded-lg p-6 border border-gray-700">
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
      </div>
    </div>
  );
};
export default ProfileView;
