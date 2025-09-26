import React, { useState } from "react";
import Profile from "./components/Profile";

function App() {
  const [viewMode, setViewMode] = useState("own"); // 'own' or 'other'

  return (
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
  );
}

export default App;

//// Future implementation with React Router
//<Route path="/profile" element={<Profile isOwnProfile={true} />} />
//<Route path="/profile/:userId" element={
 // <Profile isOwnProfile={userId === currentUser.id} />
//} />