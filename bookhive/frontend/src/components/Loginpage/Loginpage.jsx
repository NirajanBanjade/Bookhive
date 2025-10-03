import React from 'react';
import './Loginpage.css';
const Loginpage = () => {
  return (
    <div className="loginContainer">
      <div className="loginBox">
        <div className="logoSection">
          <h1 className="logoH1">Book Hive</h1>
          <p className="logoP">Welcome</p>
        </div>

        <form className="formSection">
          <div className="inputGroup">
            <label className="label">Username or Email</label>
            <input className="input" type="text" placeholder="Enter username or email" />
          </div>

          <div className="inputGroup">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="Enter password" />
          </div>

          <button className="submitBtn" type="button">Login</button>
        </form>

        <div className="toggleMode">
          <p className="toggleP">
            Don't have an account?
            <button className="toggleBtn" type="button">Register</button>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Loginpage; 