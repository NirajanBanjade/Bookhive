import React from "react";
import { Heart, MessageCircle, Star } from "lucide-react";

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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
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
                {/* Avatar */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, #78716c 0%, #57534e 100%)",
                  }}
                >
                  {activity.avatar}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="mb-2">
                    <span className="font-semibold text-gray-900">
                      {activity.user}
                    </span>
                    <span className="text-gray-600"> {activity.action} </span>
                    <span className="font-semibold text-stone-700">
                      {activity.book}
                    </span>
                  </div>

                  {/* Rating */}
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

                  {/* Comment */}
                  {activity.comment && (
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {activity.comment}
                    </p>
                  )}

                  {/* Footer */}
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
    </div>
  );
};

export default HomePage;
