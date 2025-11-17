import React from "react";

/**
 * BooksTabs Component
 * Tab navigation for filtering books by status
 */
const BooksTabs = ({ activeTab, onTabChange, bookCounts }) => {
  const tabs = [
    {
      id: "want-to-read",
      label: "Want to Read",
      count: bookCounts.wantToRead,
      activeColor: "border-orange-500 text-orange-600",
    },
    {
      id: "currently-reading",
      label: "Currently Reading",
      count: bookCounts.currentlyReading,
      activeColor: "border-blue-500 text-blue-600",
    },
    {
      id: "completed",
      label: "Completed",
      count: bookCounts.completed,
      activeColor: "border-green-500 text-green-600",
    },
    {
      id: "favorites",
      label: "Favorites",
      count: bookCounts.favorites,
      activeColor: "border-red-500 text-red-600",
    },
  ];

  return (
    <div className="flex gap-2 mb-6 border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-6 py-3 font-medium transition-colors border-b-2 ${
            activeTab === tab.id
              ? tab.activeColor
              : "border-transparent text-gray-600 hover:text-gray-900"
          }`}
        >
          {tab.label} ({tab.count})
        </button>
      ))}
    </div>
  );
};

export default BooksTabs;