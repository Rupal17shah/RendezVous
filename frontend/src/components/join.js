import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db, logout } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";
import CopyAllIcon from "@mui/icons-material/CopyAll";

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
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicIconOff from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import CallEnd from "@mui/icons-material/CallEnd";
import Chat from "@mui/icons-material/Chat";
import io from "socket.io-client";
import { Row } from "reactstrap";
import Peer from "simple-peer";
import Card from "./card";
import "./join.css";

export default function Join() {
  const [loading2, setLoading] = useState(true);
  const [localStream, setLocalStream] = useState(null);
  const navigate = useNavigate();
  const [micOn, setMicOn] = useState(true);
  const [showChat, setshowChat] = useState(true);
  const [share, setShare] = useState(false);
  const { roomID } = useParams();
  const chatScroll = useRef();
  const [pin, setPin] = useState(false);
  const [peers, setPeers] = useState([]);
  const socket = useRef();
  const peersRef = useRef([]);
  const [userData, setUserData] = useState({});

  const [videoActive, setVideoActive] = useState(true);

  const [msgs, setMsgs] = useState([]);
  const [msgText, setMsgText] = useState("");
  const localVideo = useRef();

  const [user, loading, error] = useAuthState(auth);
  const [particpentsOpen, setParticpentsOpen] = useState(true);
  const sendMessage = (e) => {
    e.preventDefault();
    if (msgText) {
      socket.current.emit("send message", {
        roomID,
        from: socket.current.id,
        user: {
          id: user.uid,
          name: user?.displayName,
          profilePic: user.photoURL,
        },
        message: msgText.trim(),
      });
    }
    setMsgText("");
  };

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setUserData(data);
    } catch (err) {
      console.error(err);
      // alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    fetchUserName();
    const unsub = () => {
      socket.current = io.connect(
        "https://pure-peak-21973.herokuapp.com/"
        // process.env.SOCKET_BACKEND_URL || "http://localhost:5000"
      );
      socket.current.on("message", (data) => {
        if (user?.uid !== data.user.id) {
          console.log("send");
        }
        const msg = {
          send: user?.uid === data.user.id,
          ...data,
        };
        setMsgs((msgs) => [...msgs, msg]);
        // setMsgs(data);
        // console.log(data);
      });
      if (user)
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true,
          })
          .then((stream) => {
            setLoading(false);
            setLocalStream(stream);
            localVideo.current.srcObject = stream;
            socket.current.emit("join-call", {
              roomID,
              user: user
                ? {
                    uid: user?.uid,
                    email: user?.email,
                    name: user?.name,
                    photoURL: user?.profileImage,
                  }
                : null,
            });
            socket.current.on("all-users", (users) => {
              const peers = [];
              users.forEach((user) => {
                const peer = createPeer(user.userId, socket.current.id, stream);
                peersRef.current.push({
                  peerID: user.userId,
                  peer,
                  user: user.user,
                });
                peers.push({
                  peerID: user.userId,
                  peer,
                  user: user.user,
                });
              });
              setPeers(peers);
            });

            socket.current.on("user joined", (payload) => {
              // console.log(payload);
              const peer = addPeer(payload.signal, payload.callerID, stream);
              peersRef.current.push({
                peerID: payload.callerID,
                peer,
                user: payload.user,
              });

              const peerObj = {
                peerID: payload.callerID,
                peer,
                user: payload.user,
              };

              setPeers((users) => [...users, peerObj]);
            });

            socket.current.on("receiving return", (payload) => {
              const item = peersRef.current.find(
                (p) => p.peerID === payload.id
              );
              item.peer.signal(payload.signal);
            });

            socket.current.on("user-left", (id) => {
              const peerObj = peersRef.current.find((p) => p.peerID === id);
              if (peerObj) peerObj.peer.destroy();
              const peers = peersRef.current.filter((p) => p.peerID !== id);
              peersRef.current = peers;
              setPeers((users) => users.filter((p) => p.peerID !== id));
            });
          });
    };
    return unsub();
  }, [user, roomID]);

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.current.emit("sending signal", {
        userToSignal,
        callerID,
        signal,
        user: user
          ? {
              uid: userData?.uid,
              email: userData?.email,
              name: userData?.name,
              photoURL: userData?.profileImage,
            }
          : null,
      });
    });

    return peer;
  };
  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });
    peer.on("signal", (signal) => {
      socket.current.emit("returning signal", { signal, callerID });
    });
    peer.signal(incomingSignal);
    return peer;
  };
  return (
    <div className="main-page" style={{ overflow: "hidden" }}>
      <header
        className=""
        style={{
          height: "15vh",
          backgroundColor: "#010817",
        }}
      >
        <Grid
          container
          spacing={2}
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{ py: 2, pb: 10 }}
        >
          <Grid item>
            <Button
              style={{
                backgroundColor: "#3f51b5",
                color: "whitesmoke",
                marginLeft: "20px",
                marginTop: "10px",
                width: "120px",
                fontSize: "10px",
              }}
              onClick={() =>
                navigator.clipboard.writeText(window.location.href)
              }
            >
              Copy invite link
            </Button>
          </Grid>
        </Grid>
      </header>
      <div
        style={{
          backgroundColor: "#041828",
          height: "100vh",
        }}
      >
        <div className="container">
          <Grid container spacing={{ xs: 3, md: 2 }} columns={{ xs: 1, sm: 4 }}>
            <Grid item xs={2}>
              <video
                ref={localVideo}
                muted
                autoPlay
                controls={false}
                width="100%"
                height="80%"
              />
              {!videoActive && (
                <div className="absolute top-0 left-0 bg-lightGray h-full w-full flex items-center justify-center">
                  <img src={userData?.profileImage} alt={userData?.name} />
                </div>
              )}
            </Grid>
            {peers.map((peer) => (
              <Card key={peer?.peerID} user={peer?.user} peer={peer?.peer} />
            ))}
          </Grid>
        </div>

        <footer
          className="fixed-bottom"
          style={{
            padding: "2vh",
            backgroundColor: "#010817",
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
                onClick={() => {
                  const videoTrack = localStream
                    .getTracks()
                    .find((track) => track.kind === "video");
                  if (videoActive) {
                    videoTrack.enabled = false;
                  } else {
                    videoTrack.enabled = true;
                  }
                  setVideoActive(!videoActive);
                }}
              >
                {videoActive ? <VideocamIcon /> : <VideocamOffIcon />}
              </IconButton>
            </Grid>
            <Grid item>
              <IconButton
                aria-label="callend"
                size="20px"
                sx={{ color: "red", border: "1px solid red" }}
                onClick={() => {
                  navigate("/");
                  window.location.reload();
                }}
              >
                <CallEnd />
              </IconButton>
            </Grid>

            <Grid item>
              <IconButton
                aria-label="mic"
                size="20px"
                sx={{ color: "white", border: "1px solid white" }}
                onClick={() => {
                  const audio =
                    localVideo.current.srcObject.getAudioTracks()[0];
                  if (micOn) {
                    audio.enabled = false;
                    setMicOn(false);
                  }
                  if (!micOn) {
                    audio.enabled = true;
                    setMicOn(true);
                  }
                }}
              >
                {micOn ? <MicIcon /> : <MicIconOff />}
              </IconButton>
            </Grid>

            {/* <Grid item>
              <IconButton
                aria-label="delete"
                size="20px"
                sx={{ color: "white", border: "1px solid white" }}
                onClick={this.handleScreen}
              >
                {this.state.screen ? (
                  <ScreenShareIcon />
                ) : (
                  <StopScreenShareIcon />
                )}
              </IconButton>
            </Grid> */}
          </Grid>
        </footer>
      </div>
    </div>
  );
}
