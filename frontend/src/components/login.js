import "./login.css";
import React, { useState, useEffect } from "react";
import GoogleButton from "react-google-button";
import Navbar from "./navbar";
import { auth, signInWithGoogle, logInWithEmailAndPassword } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    if (loading) return;
    if (user) {
      return navigate("/join");
    }
  }, [user, loading]);
  return (
    <>
      <div
        className="outer"
        style={{
          backgroundColor: "#15353d",
          paddingBottom: "150px",
        }}
      >
        <Navbar />
        <div className="box">
          <b>Login</b>
          <div className="name">
            <div className="container">
              <div className="picture-container">
                <form>
                  <div className="form-outline mb-4">
                    <input
                      type="email"
                      id="form3Example3cg"
                      className="form-control form-control-lg"
                      placeholder="Your Email ID"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      id="form3Example4cg"
                      className="form-control form-control-lg"
                      placeholder="Your Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <div className="d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn btn-info btn-block btn-lg gradient-custom-4 text-body"
                      onClick={() => logInWithEmailAndPassword(email, password)}
                    >
                      Login
                    </button>
                  </div>

                  <p className="text-center text-muted mt-5 mb-0">
                    Don't Have an account?{" "}
                    <a href="/signup" className="fw-bold text-body">
                      <u>Register here</u>
                    </a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="bttn"></div>
        <div className="googlelogin">
          <center>
            <GoogleButton
              className="googlebtn"
              type="light"
              onClick={signInWithGoogle}
            />
          </center>
        </div>
      </div>
    </>
  );
}
