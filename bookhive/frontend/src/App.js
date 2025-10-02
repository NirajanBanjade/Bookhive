import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SearchPage from "./pages/searchPage";
import Profile from "./components/Profile";
import ToReadPage from "./pages/ToReadPage"; // 👈 your new page

function App() {
  return (
    <Router>
      <div className="App">
        <nav style={{marginBottom: "1rem"}}>
          <Link to="/profile" style={{ marginRight: "1rem" }}>Profile</Link>
          <Link to="/search" style={{ marginRight: "1rem" }}>Search Books</Link>
          <Link to="/to-read">To-Read List</Link>
        </nav>

        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/to-read" element={<ToReadPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
