import React from 'react'
import "./home.css";
import background from "../bg.png";
import Logo from "../Logo.png"

export default function Home() {
    return (
      <div
        className="outer"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
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
              <a class="navbar-brand" href="/home">
                Home
              </a>
            </div>
            <div className="nav">
              <a class="navbar-brand" href="/signup">
                SignUp
              </a>
            </div>
            <div className="nav">
              <a class="navbar-brand" href="/login">
                Login
              </a>
            </div>
            <div className="nav">
              <a class="navbar-brand" href="#">
                JoinMeet
              </a>
            </div>
          </div>
        </nav>

        <center>
          <div className="rendezvous">
            WELCOME TO <br /> RENDEZVOUS
          </div>
        </center>
        <b>
          <div className="connect">helps you connect...</div>
        </b>
        <hr className="line" />
        <footer>
          <div className="about">
            <center>About Us</center>
           
          </div>
              <p className="desc">
                This is a web application for the hosting online video
                    conferencing and online meets<br />
                    <br/>   
                    CONTRIBUTERS<br/>
                    Krish Agrwal <br/>
                    Rupal Shah
              </p>
        </footer>
      </div>
    );
}
