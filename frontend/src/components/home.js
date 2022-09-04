import React from 'react'
import "./home.css";
import background from "../bg.png";
import Logo from "../Logo.png"
import Navbar from './navbar';

export default function Home() {
    return (
      <div
        className="outer"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
        }}
      >
        <Navbar />
        <center>
          <div className="welcometo">
            Welcome To <br />
          </div>
          <div className="rendezvous">RENDEZVOUS</div>
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
            This is a web application for the hosting online video conferencing
            and online meets
            <br />
            <br />
            CONTRIBUTERS
            <br />
            Krish Agrwal <br />
            Rupal Shah
          </p>
        </footer>
      </div>
    );
}
