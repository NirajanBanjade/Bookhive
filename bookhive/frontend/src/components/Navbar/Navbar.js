import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import useNotifications from "../../hooks/useNotifications";
import NotificationsDropdown from "../notifications/NotificationsDropdown";
import "./Navbar.css";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // notifications hook
  const { items, loading, error, unreadCount, onMarkAll, onMarkOne } =
    useNotifications({ pollMs: 20000 });
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");

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
    <nav className="library-navbar">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="library-logo">
            <div className="library-logo-icon">
              <svg
                className="w-5 h-5 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
            </div>
            <span className="library-logo-text">BookHive</span>
          </Link>

          {/* Search Bar */}
          <div className="library-search">
            <form onSubmit={handleSearch}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search books, authors, readers..."
                className="library-search-input"
              />
              <svg
                className="library-search-icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <button type="submit" className="library-search-btn">
                Search
              </button>
            </form>
          </div>

          {/* Right Section */}
          <div className="library-actions">
            {isLoggedIn && (
              <>
                {/* Add Book Button */}
                <button className="library-btn hidden sm:flex">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span>Add Book</span>
                </button>

                {/* Notifications */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    aria-label="Notifications"
                    className="library-notification-btn"
                    onClick={() => setOpen((v) => !v)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
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
                <Link to="/profile" className="library-profile">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Secondary Navigation */}
      <div className="library-nav-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="library-nav-links">
            <Link
              to="/home"
              className={`library-nav-link ${
                location.pathname === "/home" ? "active" : ""
              }`}
            >
              Home
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/profile"
                  className={`library-nav-link ${
                    location.pathname === "/profile" ? "active" : ""
                  }`}
                >
                  Profile
                </Link>
                <Link
                  to="/genre"
                  className={`library-nav-link ${
                    location.pathname === "/genre" ? "active" : ""
                  }`}
                >
                  Genre
                </Link>
                <Link
                  to="/my-groups"
                  className={`library-nav-link ${
                    location.pathname === "/my-groups" ? "active" : ""
                  }`}
                >
                  Joined Groups
                </Link>
              </>
            )}

            {!isLoggedIn && (
              <Link
                to="/login"
                className={`library-nav-link ${
                  location.pathname === "/login" ? "active" : ""
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
