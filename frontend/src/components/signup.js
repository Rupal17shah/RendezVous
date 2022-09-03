import "./signup.css";
import React,{useState} from 'react';
import Logo from "../Logo.png";
import GoogleButton from "react-google-button";

export default function Signup() {
    const [Img, setImg] = useState(Logo);
    const onImageChange = (e) => {
        const [file] = e.target.files;
        setImg(URL.createObjectURL(file));
    };
    return (
      <>
        <div
          className="outer"
          style={{
            backgroundColor: "#15353d",
            paddingBottom: "150px",
          }}
        >
          <nav className="navbar">
            <div className="nav">
              <a href="/" className="navbar-brand navlink">
                <img className="logo" src={Logo} alt="" />
              </a>
            </div>
            <div className="nav">
              <div className="nav">
                <a className="navbar-brand" href="#">
                  Home
                </a>
              </div>
              <div className="nav">
                <a className="navbar-brand" href="#">
                  SignUp
                </a>
              </div>
              <div className="nav">
                <a className="navbar-brand" href="#">
                  Login
                </a>
              </div>
              <div className="nav">
                <a className="navbar-brand" href="#">
                  JoinMeet
                </a>
              </div>
            </div>
          </nav>
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
                    {/* <input
                      type="file"
                      id="wizard-picture"
                      onChange={onImageChange}
                      className=""
                    /> */}
                  </div>
                  <h6 className="">Choose Picture</h6>

                  <form>
                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="form3Example1cg"
                        className="form-control form-control-lg"
                        value="Your Name"
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="email"
                        id="form3Example3cg"
                        className="form-control form-control-lg"
                        value="Your Email ID"
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="form3Example4cg"
                        className="form-control form-control-lg"
                        value="Your Password"
                      />
                    </div>

                    <div className="form-outline mb-4">
                      <input
                        type="text"
                        id="form3Example4cdg"
                        className="form-control form-control-lg"
                        value="Confirm your Password"
                      />
                    </div>

                    <div className="d-flex justify-content-center">
                      <button
                        type="button"
                        className="btn btn-info btn-block btn-lg gradient-custom-4 text-body"
                      >
                        Sign Up
                      </button>
                    </div>

                    <p className="text-center text-muted mt-5 mb-0">
                      Have already an account?{" "}
                      <a href="#!" className="fw-bold text-body">
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
                onClick={() => {
                  console.log("Google button clicked");
                }}
              />
            </center>
          </div>
        </div>
      </>
    );
}
