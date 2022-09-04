import React from "react";
import "./home.css";
import Logo from "../Logo.png";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, logout } from "../firebase";

export default function Navbar() {
  const [user, loading, error] = useAuthState(auth);
  const [url,setUrl] = React.useState("");
  const handleUrl =() =>{
    var url = Math.random().toString(36).substring(2, 10)
    window.location.href = `/join/${url}`
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a href="/" className="navbar-brand navlink">
        <img className="logo" src={Logo} alt="" />
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          <li className="nav-item navbarlink">
            <a className="nav-link" href="/">
              Home
            </a>
          </li>
          {user ? <></> : <li className="nav-item navbarlink">
            <a className="nav-link" href="/signup">
              SignUp
            </a>
          </li>}
          {user ? <></> : <li className="nav-item navbarlink">
            <a className="nav-link" href="/login">
              Login
            </a>
          </li>}
          <li className="nav-item navbarlink" style={{cursor:"pointer"}}>
            <a className="nav-link" onClick={handleUrl}>
              Join
            </a>
          </li>
          {user ? <li className="nav-item navbarlink">
            <a className="nav-link" href="/" onClick={logout}>
              Logout
            </a>
          </li> : <></>}
        </ul>
      </div>
    </nav>
  );
}
