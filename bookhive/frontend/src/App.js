import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Profile from "./components/Profile";
import ToReadPage from "./pages/ToReadPage"; // 👈 your new page

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Profile />} />         {/* Profile page */}
          <Route path="/to-read" element={<ToReadPage />} /> {/* To-Read page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
