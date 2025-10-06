import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Profile from "./components/Profile";
import SearchPage from "./pages/searchPage";
import ToReadPage from "./pages/ToReadPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/to-read" element={<ToReadPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
