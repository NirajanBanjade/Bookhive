import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import React, { useState } from "react";
import Profile from "./components/Profile";
import ToReadPage from "./pages/ToReadPage";
import SearchPage from "./pages/SearchPage";

function App() {
  const [viewMode, setViewMode] = useState("own"); // 'own' or 'other'

  return (
    <div>
      <Router>
        <div className="App" style={{ maxWidth: 980, margin: "0 auto" }}>
          {/* simple nav so you can click around */}
          <nav style={{ display: "flex", gap: 12, padding: "12px 0" }}>
            <Link to="/">Profile</Link>
            <Link to="/search">Search</Link>
            <Link to="/to-read">To-Read</Link>
          </nav>

          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/to-read" element={<ToReadPage />} />
          </Routes>
        </div>
      </Router>
      <div className="App">
        <div style={{ padding: "20px", textAlign: "center" }}>
          <button onClick={() => setViewMode("own")}>
            View My Profile (Editable)
          </button>
          <button
            onClick={() => setViewMode("other")}
            style={{ marginLeft: "10px" }}
          >
            View Other Profile (Read-Only)
          </button>
        </div>

        <Profile isOwnProfile={viewMode === "own"} />
      </div>
    </div>
  );
}

export default App;

//// Future implementation with React Router
//<Route path="/profile" element={<Profile isOwnProfile={true} />} />
//<Route path="/profile/:userId" element={
// <Profile isOwnProfile={userId === currentUser.id} />
//} />
