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
      activeColor: "border-amber-500 text-amber-400 bg-gray-700",
      hoverColor: "hover:text-amber-300 hover:bg-gray-750",
    },
    {
      id: "currently-reading",
      label: "Currently Reading",
      count: bookCounts.currentlyReading,
      activeColor: "border-orange-500 text-orange-400 bg-gray-700",
      hoverColor: "hover:text-orange-300 hover:bg-gray-750",
    },
    {
      id: "re-reading",
      label: "Re-reading",
      count: bookCounts.reReading,
      activeColor: "border-purple-500 text-purple-400 bg-gray-700",
      hoverColor: "hover:text-purple-300 hover:bg-gray-750",
    },
    {
      id: "completed",
      label: "Completed",
      count: bookCounts.completed,
      activeColor: "border-emerald-500 text-emerald-400 bg-gray-700",
      hoverColor: "hover:text-emerald-300 hover:bg-gray-750",
    },
    {
      id: "favorites",
      label: "Favorites",
      count: bookCounts.favorites,
      activeColor: "border-red-500 text-red-400 bg-gray-700",
      hoverColor: "hover:text-red-300 hover:bg-gray-750",
    },
  ];
  return (
    <div className="mb-6 bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 px-4 py-3 font-medium transition-all duration-200 border-b-3 ${
              activeTab === tab.id
                ? `${tab.activeColor} border-b-3`
                : `border-transparent text-gray-400 bg-gray-800 ${tab.hoverColor}`
            }`}
          >
            <span className="text-sm font-semibold">
              {tab.label} ({tab.count})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
export default BooksTabs;
