import './App.css';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Home from "./components/home";
import Login from "./components/login";
import Signup from "./components/signup";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
