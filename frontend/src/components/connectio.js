import React, { useEffect, useRef } from "react";
import Peer from "simple-peer";

const [loading2, setLoading] = useState(true);
const [localStream, setLocalStream] = useState(null);
const navigate = useNavigate();
const [micOn, setMicOn] = useState(true);
const [showChat, setshowChat] = useState(true);
const [share, setShare] = useState(false);
const [joinSound] = useState(new Audio(joinSFX));
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
    alert("An error occured while fetching user data");
  }
};

useEffect(() => {
  if (loading) return;
  if (!user) return navigate("/login");
  fetchUserName();
  const unsub = () => {
    socket.current = io.connect(
      "http://localhost:5000"
      // process.env.SOCKET_BACKEND_URL || "http://localhost:5000"
    );
    socket.current.on("message", (data) => {
      const audio = new Audio(msgSFX);
      if (user?.uid !== data.user.id) {
        console.log("send");
        audio.play();
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
                  uid: userData?.uid,
                  email: userData?.email,
                  name: userData?.name,
                  photoURL: userData?.profileImage,
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
            const item = peersRef.current.find((p) => p.peerID === payload.id);
            item.peer.signal(payload.signal);
          });

          socket.current.on("user-left", (id) => {
            const audio = new Audio(leaveSFX);
            audio.play();
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
