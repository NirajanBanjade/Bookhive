import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SearchPage from "./pages/searchPage";
import Profile from "./components/Profile";

function App() {
  return (
    <Router>

      <div className="App">

        {/* <Profile /> */}
        <nav style={{marginBottom: "1rem"}}>
          <Link to="/profile" style={{ marginRight: "1rem" }}>Profile</Link>
          <Link to="/search">Search Books</Link>
        </nav>

        <Routes>
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>

      </div>

    </Router>
  );
}

export default App;
