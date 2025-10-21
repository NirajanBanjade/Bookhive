import React, { useState, useEffect } from "react"; // 🆕 Added useState, useEffect
import {
  Heart,
  MessageCircle,
  Star,
  Sparkles,
  BookOpen,
  Target,
  TrendingUp,
  Calendar,
  Flame, // 🆕 Added Flame icon for trending
} from "lucide-react";
import { getTrendingBooks } from "../../api/books"; 

const HomePage = () => {
  // 🆕 NEW STATE - Trending books
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState(null);

  // 🆕 NEW EFFECT - Fetch trending books on mount
  useEffect(() => {
    const controller = new AbortController();

    async function fetchTrending() {
      try {
        setTrendingLoading(true);
        const data = await getTrendingBooks({
          limit: 5,
          signal: controller.signal,
        });
        setTrendingBooks(data.trending || []);
        setTrendingError(null);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Failed to fetch trending books:", err);
          setTrendingError("Failed to load trending books");
        }
      } finally {
        setTrendingLoading(false);
      }
    }

    fetchTrending();

    return () => controller.abort();
  }, []);

  // TODO: Replace with API call to /api/activity/:userId
  const activities = [
    {
      id: 1,
      user: "Sarah Chen",
      avatar: "SC",
      action: "finished reading",
      book: "The Song of Achilles",
      rating: 5,
      time: "2 hours ago",
      comment:
        "Absolutely breathtaking. The way Miller reimagines this ancient story is stunning. The prose is lyrical and the emotions are so raw.",
      likes: 12,
      comments: 3,
    },
    {
      id: 2,
      user: "Michael Torres",
      avatar: "MT",
      action: "started reading",
      book: "Project Hail Mary",
      time: "5 hours ago",
      likes: 8,
      comments: 2,
    },
    {
      id: 3,
      user: "Emma Wilson",
      avatar: "EW",
      action: "added a review for",
      book: "Tomorrow, and Tomorrow, and Tomorrow",
      rating: 4,
      time: "1 day ago",
      comment:
        "A beautiful exploration of friendship, creativity, and the games we play.",
      likes: 15,
      comments: 5,
    },
  ];

  // TODO: Replace with API call to /api/books/recommendations/:userId
  const recommendations = [
    {
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      genre: "Historical Fiction",
      rating: 4.5,
      gradient: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
    },
    {
      title: "Lessons in Chemistry",
      author: "Bonnie Garmus",
      genre: "Fiction",
      rating: 4.3,
      gradient: "linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)",
    },
    {
      title: "The Silent Patient",
      author: "Alex Michaelides",
      genre: "Thriller",
      rating: 4.1,
      gradient: "linear-gradient(135deg, #e9d5ff 0%, #d8b4fe 100%)",
    },
  ];

  // TODO: Replace with API call to /api/collections/:userId/currently-reading
  const currentlyReading = [
    {
      id: 1,
      title: "The Midnight Library",
      author: "Matt Haig",
      currentPage: 201,
      totalPages: 300,
      progress: 67,
    },
    {
      id: 2,
      title: "Atomic Habits",
      author: "James Clear",
      currentPage: 102,
      totalPages: 300,
      progress: 34,
    },
  ];

  // TODO: Replace with API call to /api/reading-goals/:userId
  const readingGoal = {
    year: 2025,
    targetBooks: 52,
    booksRead: 23,
    progress: 44,
    booksAhead: 3,
    weekStreak: 12,
  };

  // TODO: Future feature - Replace with API call to /api/communities/joined/:userId
  // For Reddit-style book communities/subreddits
  const communities = [
    { name: "Fantasy Readers", members: "45K", icon: "🐉" },
    { name: "Mystery & Thriller Club", members: "32K", icon: "🔍" },
    { name: "Historical Fiction Fans", members: "28K", icon: "📜" },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fafaf9" }}>
      {/* Hero Banner */}
      <div
        className="relative h-96 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=1600&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-800/75 to-slate-700/60 flex items-center">
          <div className="max-w-7xl mx-auto px-6">
            <h1 className="text-6xl font-bold text-white mb-4 font-serif">
              Welcome to BookHive
            </h1>
            <p className="text-xl text-gray-100 max-w-2xl">
              Your cozy corner for tracking reads, discovering new favorites,
              and connecting with fellow book lovers
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* LEFT SIDEBAR - Trending, Currently Reading & Goals */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* 🆕 NEW - Trending Books Widget */}
              <div
                className="bg-white rounded-xl p-6 border border-gray-200"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <Flame className="h-5 w-5 text-orange-600" />
                  <h3 className="font-bold text-gray-900 text-lg">
                    Trending Now
                  </h3>
                </div>

                {trendingLoading ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    Loading trending books...
                  </div>
                ) : trendingError ? (
                  <div className="text-center py-8 text-red-500 text-sm">
                    {trendingError}
                  </div>
                ) : trendingBooks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 text-sm">
                    No trending books available
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trendingBooks.map((book, index) => (
                      <div
                        key={book.isbn || index}
                        className="flex gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {book.rank || index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1">
                            {book.title}
                          </h4>
                          <p className="text-xs text-gray-600 line-clamp-1">
                            {book.authors?.[0] || "Unknown Author"}
                          </p>
                          {book.weeksOnList > 0 && (
                            <p className="text-xs text-orange-600 font-medium mt-1">
                              {book.weeksOnList} week
                              {book.weeksOnList !== 1 ? "s" : ""} on list
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Currently Reading Widget */}
              <div
                className="bg-white rounded-xl p-6 border border-gray-200"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <BookOpen className="h-5 w-5 text-amber-600" />
                  <h3 className="font-bold text-gray-900 text-lg">
                    Currently Reading
                  </h3>
                </div>

                <div className="space-y-4">
                  {currentlyReading.map((book) => (
                    <div
                      key={book.id}
                      className="p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">
                        {book.title}
                      </h4>
                      <p className="text-xs text-gray-600">{book.author}</p>
                    </div>
                  ))}
                </div>

                <button className="mt-5 w-full py-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors">
                  View All →
                </button>
              </div>

              {/* Reading Goal Widget */}
              <div
                className="bg-white rounded-xl p-6 border border-gray-200"
                style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <Target className="h-5 w-5 text-amber-600" />
                  <h3 className="font-bold text-gray-900 text-lg">
                    {readingGoal.year} Reading Goal
                  </h3>
                </div>

                {/* Goal Progress */}
                <div className="mb-5">
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="text-4xl font-bold text-gray-900">
                      {readingGoal.booksRead}
                    </span>
                    <span className="text-sm text-gray-600">
                      of {readingGoal.targetBooks} books
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="absolute h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all"
                      style={{ width: `${readingGoal.progress}%` }}
                    />
                  </div>

                  <p className="text-xs text-gray-600">
                    {readingGoal.progress}% complete •{" "}
                    {readingGoal.targetBooks - readingGoal.booksRead} books to
                    go
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-teal-600">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-xs font-medium">On Track</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      +{readingGoal.booksAhead} ahead
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-orange-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-xs font-medium">Week Streak</span>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {readingGoal.weekStreak} weeks 🔥
                    </p>
                  </div>
                </div>
              </div>

              {/* TODO: Future Feature - Book Communities Preview */}
              {/* Uncomment when Reddit-style communities are implemented */}
              {/* 
              <div className="bg-white rounded-xl p-6 border border-gray-200" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                <h3 className="font-bold text-gray-900 text-lg mb-4">Your Communities</h3>
                <div className="space-y-3">
                  {communities.map((community, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                      <span className="text-2xl">{community.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">{community.name}</p>
                        <p className="text-xs text-gray-600">{community.members} members</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-4 w-full py-2 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors">
                  Explore Communities →
                </button>
              </div>
              */}
            </div>
          </div>

          {/* CENTER - Friend Activity */}
          <div className="lg:col-span-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 font-serif">
              Friend Activity
            </h2>

            <div className="space-y-6">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-lg hover:border-stone-300 transition-all duration-300"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                >
                  <div className="flex gap-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xl hover:scale-110 transition-transform"
                      style={{
                        background:
                          "linear-gradient(135deg, #78716c 0%, #57534e 100%)",
                      }}
                    >
                      {activity.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="mb-2">
                        <span className="font-semibold text-gray-900">
                          {activity.user}
                        </span>
                        <span className="text-gray-600">
                          {" "}
                          {activity.action}{" "}
                        </span>
                        <span className="font-semibold text-stone-700">
                          {activity.book}
                        </span>
                      </div>
                      {activity.rating && (
                        <div className="flex items-center gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 transition-all ${
                                i < activity.rating
                                  ? "fill-amber-500 text-amber-500"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      {activity.comment && (
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {activity.comment}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          {activity.time}
                        </span>
                        <div className="flex gap-4">
                          <button className="flex items-center gap-2 text-gray-600 hover:text-stone-700 hover:scale-110 transition-all">
                            <Heart className="h-5 w-5" />
                            <span className="text-sm">{activity.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-stone-700 hover:scale-110 transition-all">
                            <MessageCircle className="h-5 w-5" />
                            <span className="text-sm">{activity.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDEBAR - Recommendations */}
          <div className="lg:col-span-3">
            <div className="lg:sticky lg:top-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-6 w-6 text-amber-600" />
                <h2 className="text-xl font-bold text-gray-800 font-serif">
                  Books You Might Love
                </h2>
              </div>

              <div className="space-y-5">
                {recommendations.map((book, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                  >
                    <div
                      className="aspect-[3/4] flex items-center justify-center p-6"
                      style={{ background: book.gradient }}
                    >
                      <h3 className="text-xl font-serif font-bold text-gray-800 text-center leading-tight">
                        {book.title}
                      </h3>
                    </div>

                    <div className="p-5">
                      <h4 className="font-bold text-gray-900 mb-1 line-clamp-2">
                        {book.title}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">
                        {book.author}
                      </p>
                      <span className="inline-block px-3 py-1 bg-stone-100 text-stone-700 text-xs font-medium rounded-full mb-3">
                        {book.genre}
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 transition-all ${
                              i < Math.floor(book.rating)
                                ? "fill-amber-500 text-amber-500"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-sm text-gray-700 ml-2 font-semibold">
                          {book.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
