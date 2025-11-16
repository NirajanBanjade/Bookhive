// frontend/src/components/Navbar/Navbar.js
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useNotifications from "../../hooks/useNotifications";
import NotificationsDropdown from "../notifications/NotificationsDropdown";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // notifications hook
  const {
    items,
    loading,
    error,
    unreadCount,
    onMarkAll,
    onMarkOne,
  } = useNotifications({ pollMs: 20000 });
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token"); // simple auth check

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  // close dropdown on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-primary">BookHive</span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors, users..."
                className="w-full px-4 py-2 pl-10 pr-24 text-gray-700 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                type="submit"
                className="absolute right-2 top-1.5 px-3 py-1 bg-primary text-white text-sm rounded-md hover:bg-primary-hover transition-colors"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">

            {isLoggedIn && (
              <>
                {/* Add Book Button */}
                <button className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="font-medium">Add Book</span>
                </button>

                {/* Notifications */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    aria-label="Notifications"
                    className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setOpen((v) => !v)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>

                    {/* Badge */}
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] leading-[18px] text-center rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Dropdown */}
                  <NotificationsDropdown
                    open={open}
                    loading={loading}
                    error={error}
                    items={items}
                    unreadCount={unreadCount}
                    onMarkAll={onMarkAll}
                    onMarkOne={onMarkOne}
                    onClose={() => setOpen(false)}
                  />
                </div>

                {/* User Profile */}
                <Link to="/profile" className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">

                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 py-3">
            {/*Always visible links*/}
            <Link to="/home" className={`text-sm font-medium transition-colors ${location.pathname === '/home' ? 'text-orange-500' : 'text-gray-700 hover:text-primary'}`}>Home</Link>
            <Link to="/search" className={`text-sm font-medium transition-colors ${location.pathname === '/search' ? 'text-orange-500' : 'text-gray-700 hover:text-primary'}`}>Search</Link>

            {/*Loggen-in only links*/}
            {isLoggedIn && (
              <>
                <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
                  Profile
                </Link>

                <Link to="/genre" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">Genre</Link>
                <Link to="/to-read" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">To-Read</Link>
                <Link to="/my-groups" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">Joined Groups</Link>
              </>
            )}

            {/*Show login/signup if not logged in*/}
            {!isLoggedIn && (
              <>
                <Link to="/login" className={`text-sm font-medium transition-colors ${location.pathname === '/login' ? 'text-orange-500' : 'text-gray-700 hover:text-primary'}`}>Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
