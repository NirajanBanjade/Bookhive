import React from "react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-yellow-50 rounded-xl p-8 mb-8 border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to BookHive 📚
          </h1>
          <p className="text-lg text-gray-600">
            Your personalized book dashboard and reading community
          </p>
        </div>

        {/* Placeholder Sections */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Featured Books Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Featured Books
            </h2>
            <p className="text-gray-600">
              Discover trending books and personalized recommendations coming
              soon...
            </p>
          </div>

          {/* Recent Activity Section */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <p className="text-gray-600">
              See what your friends are reading and their latest reviews...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
