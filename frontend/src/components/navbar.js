import React from "react";
import "./home.css";
import Logo from "../Logo.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../firebase";

export default function Navbar() {
  const [user, loading, error] = useAuthState(auth);
  return (
    <nav className="navbar">
      <div className="nav">
        <a href="/" className="navbar-brand navlink">
          <img className="logo" src={Logo} alt="" />
        </a>
      </div>
      <div className="nav">
        <div className="nav">
          <a className="navbar-brand" href="/">
            Home
          </a>
        </div>
        {user ? (
          <></>
        ) : (
          <div className="nav">
            <a className="navbar-brand" href="/signup">
              SignUp
            </a>
          </div>
        )}
        {user ? (
          <></>
        ) : (
          <div className="nav">
            <a className="navbar-brand" href="/login">
              Login
            </a>
          </div>
        )}
        <div className="nav">
          <a className="navbar-brand" href="/join">
            JoinMeet
          </a>
        </div>
        <div className="nav">
          <a className="navbar-brand" href="/" onClick={logout}>
            Logout
          </a>
        </div>
      </div>
    </nav>
  );
}
