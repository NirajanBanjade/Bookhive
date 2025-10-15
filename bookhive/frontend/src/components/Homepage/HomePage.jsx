import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner with Subtle Overlay */}
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

      {/* Placeholder Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-gray-600">Content sections coming next...</p>
      </div>
    </div>
  );
};

export default HomePage;
