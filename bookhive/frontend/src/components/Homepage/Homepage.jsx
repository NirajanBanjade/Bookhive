import React from 'react'
import { useNavigate } from 'react-router-dom';
const Homepage = () => {
const navigate = useNavigate();
  return (
    <div className="home">
    {/* <button className="primary-btn" onClick={() => navigate("/login")}>
      Login / Register
    </button> */}
  </div>
  )
}

export default Homepage;