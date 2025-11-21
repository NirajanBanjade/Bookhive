import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./components/Profile";
import SearchPage from "./pages/searchPage";
import ToReadPage from "./pages/ToReadPage";
import Loginpage from "./components/Loginpage/Loginpage";
import HomePage from "./components/Homepage/HomePage";
import GenrePage from "./pages/GenrePage";
import GenreResultsPage from "./pages/GenreResultsPage";
import JoinedGroups from "./components/Joined_groups/Joined_groups";
import BookDetails from "./pages/BookDetails";
import GroupPage from "./components/Grouppage/Grouppage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/login" element={<Loginpage />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/book/:googleBookId" element={<BookDetails />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/to-read"
              element={
                <ProtectedRoute>
                  <ToReadPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-groups"
              element={
                <ProtectedRoute>
                  <JoinedGroups />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups/:category"
              element={
                <ProtectedRoute>
                  <GroupPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/genre"
              element={
                <ProtectedRoute>
                  <GenrePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/genre/:genreId"
              element={
                <ProtectedRoute>
                  <GenreResultsPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
