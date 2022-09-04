import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import Navbar from "./navbar";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  Snackbar,
  Alert,
  BottomNavigation,
  BottomNavigationAction,
  IconButton,
} from "@mui/material";
import { white, red } from "@mui/material/colors";
import VideocamIcon from "@mui/icons-material/Videocam";
import MicIcon from "@mui/icons-material/Mic";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import CallEnd from "@mui/icons-material/CallEnd";
import Chat from "@mui/icons-material/Chat";

export default function Join() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    fetchUserName();
  }, [user, loading]);
  return (
    <>
      <div>
        <Navbar />
        <div className="dashboard__container">
          Logged in as
          <div>{name}</div>
          <div>{user?.email}</div>
          <button className="dashboard__btn" onClick={logout}>
            Logout
          </button>
        </div>

        <footer
          className="fixed-bottom"
          style={{
            padding: "2vh",
            backgroundColor: "#062667",
          }}
        >
          <Grid
            container
            spacing={3}
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <IconButton
                aria-label="videocam"
                size="20px"
                sx={{ color: "white", border: "1px solid white" }}
              >
                <VideocamIcon />
              </IconButton>
            </Grid>

            <Grid item>
              <IconButton
                aria-label="mic"
                size="20px"
                sx={{ color: "white", border: "1px solid white" }}
              >
                <MicIcon />
              </IconButton>
            </Grid>

            <Grid item>
              <IconButton
                aria-label="callend"
                size="20px"
                sx={{ color: "red", border: "1px solid red" }}
              >
                <CallEnd />
              </IconButton>
            </Grid>

            <Grid item>
              <IconButton
                aria-label="delete"
                size="20px"
                sx={{ color: "white", border: "1px solid white" }}
              >
                <ScreenShareIcon />
              </IconButton>
            </Grid>

            <Grid item>
              <IconButton
                aria-label="delete"
                size="20px"
                sx={{ color: "white", border: "1px solid white" }}
              >
                <Chat />
              </IconButton>
            </Grid>
          </Grid>
        </footer>
      </div>
    </>
  );
}
