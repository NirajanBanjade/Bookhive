import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./components/Profile";
import SearchPage from "./pages/searchPage";
import ToReadPage from "./pages/ToReadPage";
import Loginpage from "./components/Loginpage/Loginpage";
import HomePage from "./components/Homepage/HomePage";
import GenrePage from "./pages/GenrePage";
import GenreResultsPage from "./pages/GenreResultsPage";
import JoinedGroups from "./components/Joined_groups/Joined_groups";
import GroupPage from "./components/Grouppage/Grouppage";
/**
 * Main App Component - Application Routing
 *
 * Current Routes:
 * - / : User profile
 * - /home : Home feed with friend activity
 * - /search : Book search (title, author, keywords)
 * - /to-read : User's to-read list
 * - /genre : Browse all genres (grid view)
 * - /genre/:genreId : Filtered books by genre (NEW)
 * - /login : Authentication page
 *
 * TODO Phase 2 - Future Routes to Add:
 * - /book/:googleBookId : Individual book detail page
 * - /author/:authorName : Author's books page
 * - /communities : Reddit-style book communities
 * - /community/:communityId : Single community view
 * - /user/:userId : Other user's public profile
 * - /settings : User settings and preferences
 * - /notifications : User notifications center
 *
 * TODO Phase 3 - Protected Routes:
 * When authentication is complete, wrap routes with ProtectedRoute component:
 * <Route path="/to-read" element={<ProtectedRoute><ToReadPage /></ProtectedRoute>} />
 *
 * @component
 */
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            {/* Authentication */}
            <Route path="/login" element={<Loginpage />} />

            {/* Main Pages */}
            <Route path="/" element={<Profile />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/to-read" element={<ToReadPage />} />
            <Route path="/my-groups" element={<JoinedGroups />} />

            {/* Genre Routes */}
            <Route path="/genre" element={<GenrePage />} />
            <Route path="/genre/:genreId" element={<GenreResultsPage />} />
            <Route path="/groups/:category" element={<GroupPage />} />

            {/* TODO Phase 2: Add these routes when pages are ready */}
            {/* <Route path="/book/:googleBookId" element={<BookDetailPage />} /> */}
            {/* <Route path="/author/:authorName" element={<AuthorPage />} /> */}
            {/* <Route path="/communities" element={<CommunitiesPage />} /> */}
            {/* <Route path="/community/:communityId" element={<CommunityPage />} /> */}
            {/* <Route path="/user/:userId" element={<UserProfilePage />} /> */}
            {/* <Route path="/settings" element={<SettingsPage />} /> */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
