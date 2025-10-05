import React from 'react'

const Homepage = () => {
  return (
    <div className="home">
    <button className="primary-btn" onClick={() => navigate("/login")}>
      Login / Register
    </button>
  </div>
  )
}

export default Homepage