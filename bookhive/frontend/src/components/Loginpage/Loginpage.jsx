import React from 'react';
import './Loginpage.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Loginpage = () => {
  const [mode, setMode] = useState('login');
  const [user, setuser] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [resetCode, setResetCode] = useState("");
  const [newPw, setNewPw] = useState("");
  const [newPw2, setNewPw2] = useState("");
  const navigate = useNavigate();




  const BASE_URL =
    process.env.REACT_APP_API_URL ||
    "";


  const handleModeSwitch = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setuser("");
    setemail("");
    setpassword("");
    setDateOfBirth("");
    setIdentifier("");
    setConfirmPassword("");
    setResetCode("");
    setNewPw("");
    setNewPw2("");
  }
  async function handle(res) {
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.message || data?.error || `HTTP ${res.status}`;
      throw new Error(msg);
    }
    return data;
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      if (mode === "login") {
        if (!identifier || !password) return alert("Please fill all fields.");
        console.log("Login", { identifier, password });
        const res = await fetch(`${BASE_URL}/api/users/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name_email: identifier, password }),
        });
        const data = await handle(res);
        localStorage.setItem("token", data.token);
        localStorage.setItem("isMinor", data.isMinor);
        localStorage.setItem("userId", data.userId);
        setSuccessMsg("Log in successful!!!");
        navigate("/home");
        
      } else if (mode === "register") {
        if (!user || !email || !password || !confirmPassword || !dateOfBirth)
          return alert("Please fill all fields.");
        if (password !== confirmPassword)
          return alert("Passwords do not match.");
        console.log("Register", { username: user, email, password, dateOfBirth });

        const res = await fetch(`${BASE_URL}/api/users/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user, email, password, dateOfBirth }),
        });
        const data = await handle(res);
        setSuccessMsg("Registered successfully. Please log in!!!");
      }

      else if (mode === "forgot") {
        if (!email) return setErrorMsg("Enter your email to send code.");
        const res = await fetch(`${BASE_URL}/api/update-password/request-password-reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        await handle(res);
        setSuccessMsg("If the email is registered, a reset code has been sent.");
        setMode("reset");

      }
      if (mode === "reset") {
        if (!resetCode || !newPw || !newPw2) return setErrorMsg("Please fill all fields.");
        if (newPw !== newPw2) return setErrorMsg("Passwords do not match.");
        const res = await fetch(`${BASE_URL}/api/update-password/reset-password-with-code`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, code: resetCode, newPassword: newPw }),
        });
        await handle(res);
        setSuccessMsg("Password reset successful. Please log in with your new password.");
        setMode("login");
      }
      setErrorMsg("");
    } catch (err) {
      setErrorMsg(err.message || "Something went wrong. Please try again.");
      console.error(err);
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
          {errorMsg && (
            <div className="formError" role="alert" aria-live="polite">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="formSuccess" role="status" aria-live="polite">
              {successMsg}
            </div>
          )}
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
              <div className="forgotRow">
                <button type="button" className="forgotBtn" onClick={() => setMode('forgot')}>
                  Forgot password?
                </button>
              </div>
            </>

          ) : mode === "register" ? (
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
                <label className="label">Date of Birth</label>
                <input 
                  className="input" 
                  type="date" 
                  value={dateOfBirth} 
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
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
          ) : mode === "forgot" ? (
            <>
              <h4 className="fpTitle">Reset your password</h4>
              <div className="inputGroup">
                <label className="label">Email</label>
                <input className="input" type="email" placeholder="you@example.com" value={email}
                  onChange={(e) => setemail(e.target.value)} />
              </div>
              <div className="fpActions">
                <button className="submitBtn" type="submit">Send token</button>
              </div>
            </>
          ) : mode === "reset" ? (
            <>
              <h4 className="fpTitle">Enter code & new password</h4>

              <div className="inputGroup">
                <label className="label">Email</label>
                <input
                  className="input"
                  type="email"
                  value={email}
                  onChange={(e) => setemail(e.target.value)}
                  disabled
                />
              </div>

              <div className="inputGroup">
                <label className="label">Verification code</label>
                <input
                  className="input"
                  type="text"
                  placeholder="6-digit code"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                />
              </div>

              <div className="inputGroup">
                <label className="label">New password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="New password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                />
              </div>

              <div className="inputGroup">
                <label className="label">Confirm new password</label>
                <input
                  className="input"
                  type="password"
                  placeholder="Confirm password"
                  value={newPw2}
                  onChange={(e) => setNewPw2(e.target.value)}
                />
              </div>

              <div className="fpActions">
                <button className="submitBtn" type="submit">Update password</button>
              </div>

              <div className="forgotRow" style={{ marginTop: 8 }}>
                <button type="button" className="toggleBtn" onClick={() => setMode('forgot')}>
                  ← Back
                </button>
              </div>


            </>
          ):null}
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
