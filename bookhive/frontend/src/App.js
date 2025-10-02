import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Profile from "./components/Profile";
import ToReadPage from "./pages/ToReadPage";
import SearchPage from "./pages/SearchPage"; 

function App() {
  return (
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
  );
}

export default App;
