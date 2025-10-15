import React from "react";
import { Heart, MessageCircle, Star, Sparkles } from "lucide-react";

const HomePage = () => {
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

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Friend Activity - Left Column */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 font-serif">
              Friend Activity
            </h2>

            <div className="space-y-6">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white rounded-xl p-6 border border-gray-200"
                  style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
                >
                  <div className="flex gap-4">
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xl"
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
                              className={`h-5 w-5 ${
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
                          <button className="flex items-center gap-2 text-gray-600 hover:text-stone-700 transition-colors">
                            <Heart className="h-5 w-5" />
                            <span className="text-sm">{activity.likes}</span>
                          </button>
                          <button className="flex items-center gap-2 text-gray-600 hover:text-stone-700 transition-colors">
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

          {/* Recommendations Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-8">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="h-6 w-6 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-800 font-serif">
                  Books You Might Love
                </h2>
              </div>

              <div className="space-y-5">
                {recommendations.map((book, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    {/* Book Cover */}
                    <div
                      className="aspect-[3/4] flex items-center justify-center p-6"
                      style={{ background: book.gradient }}
                    >
                      <h3 className="text-xl font-serif font-bold text-gray-800 text-center leading-tight">
                        {book.title}
                      </h3>
                    </div>

                    {/* Book Info */}
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
                            className={`h-4 w-4 ${
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
