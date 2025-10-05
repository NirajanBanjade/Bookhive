import React from 'react';
import './Loginpage.css';
import { useState } from 'react';
const Loginpage = () => {
  const [mode, setMode] = useState('login');
  const [user, setuser] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleModeSwitch = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setuser("");
    setemail("");
    setpassword("");
    setIdentifier("");
    setConfirmPassword("");
  }
  const onSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      if (!identifier || !password) return alert("Please fill all fields.");
      console.log("Login", { identifier, password });
    } else {
      if (!user || !email || !password || !confirmPassword)
        return alert("Please fill all fields.");
      if (password !== confirmPassword)
        return alert("Passwords do not match.");
      console.log("Register", { username: user, email, password });
    }
  };

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <div className="logoSection">
          <h1 className="logoH1">Book Hive</h1>
          <p className="logoP">{mode === "login" ? "Welcome" : "Create your account"}</p>
        </div>

        <form className="formSection" onSubmit={onSubmit}>
          {mode === "login" ? (
            <>
              <div className="inputGroup">
                <label className="label" >Username or Email</label>
                <input className="input" type="text" placeholder="Enter username or email" value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)} />
              </div>
              <div className="inputGroup">
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="Enter password" value={password}
                  onChange={(e) => setpassword(e.target.value)} />
              </div>
              <button className="submitBtn" type="submit">Login</button>
            </>
          ) : (
            <>
              <div className="inputGroup">
                <label className="label">Username</label>
                <input className="input" type="text" placeholder="Choose a username" value={user}
                  onChange={(e) => setuser(e.target.value)} />
              </div>
              <div className="inputGroup">
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="Enter your email" value={email} onChange={(e) => setemail(e.target.value)} />
              </div>
              <div className="inputGroup">
                <label className="label">Password</label>
                <input className="input" type="password" placeholder="Create password" value={password} onChange={(e) => setpassword(e.target.value)} />
              </div>
              <div className="inputGroup">
                <label className="label">Confirm Password</label>
                <input className="input" type="password" placeholder="Re-enter password" onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <button className="submitBtn" type="submit">Create account</button>
            </>
          )}
        </form>

        <div className="toggleMode">
          <p className="toggleP">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button className="toggleBtn" type="button" onClick={handleModeSwitch}>
              {mode === "login" ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
export default Loginpage; 