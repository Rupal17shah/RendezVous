import "./signup.css";
import React, { useState, useEffect } from "react";
import Logo from "../Logo.png";
import GoogleButton from "react-google-button";
import Navbar from "./navbar";
import { registerWithEmailAndPassword, auth, signInWithGoogle } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [Img, setImg] = useState(Logo);
  const [file, setFile] = useState(Logo);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const onImageChange = (e) => {
    const [file] = e.target.files;
    setImg(URL.createObjectURL(file));
    setFile(file);
  };
  useEffect(() => {
    if (loading) return;
    if (user){ 
      return navigate("/join")
    };
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
          <b>Sign Up</b>
          <div className="name">
            <div className="container">
              <div className="picture-container">
                <div className="picture">
                  <img
                    src={Img}
                    className="picture-src"
                    id="wizardPicturePreview"
                    title=""
                  />
                  <input
                    type="file"
                    id="wizard-picture"
                    onChange={onImageChange}
                    className=""
                  />
                </div>
                <h6 className="">Choose Picture</h6>

                <form>
                  <div className="form-outline mb-4">
                    <input
                      type="text"
                      id="form3Example1cg"
                      className="form-control form-control-lg"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

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

                  <div className="form-outline mb-4">
                    <input
                      type="password"
                      id="form3Example4cdg"
                      className="form-control form-control-lg"
                      placeholder="Confirm your Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>

                  <div className="d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn btn-info btn-block btn-lg gradient-custom-4 text-body"
                      onClick={() =>
                        registerWithEmailAndPassword(
                          name,
                          email,
                          password,
                          file
                        )
                      }
                    >
                      Sign Up
                    </button>
                  </div>

                  <p className="text-center text-muted mt-5 mb-0">
                    Have already an account?{" "}
                    <a href="/login" className="fw-bold text-body">
                      <u>Login here</u>
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
