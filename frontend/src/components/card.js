import React, { useEffect, useRef, useState } from "react";
import { Grid } from "@mui/material";
import { db } from "../firebase";
import { query, collection, getDocs, where } from "firebase/firestore";

export default function Card({ user, micActive, peer }) {
  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setUserData(data);
    } catch (err) {
      console.error(err);
      //   alert("An error occured while fetching user data");
    }
  };
  const [userData, setUserData] = useState({});
  const videoRef = useRef();
  const [videoActive, setVideoActive] = useState(true);
  useEffect(() => {
    fetchUserName();
    peer.on("stream", (stream) => {
      setVideoActive(
        stream.getTracks().find((track) => track.kind === "video").enabled
      );
      videoRef.current.srcObject = stream;
    });
  }, []);

  return (
    <Grid item xs={2}>
      <video
        ref={videoRef}
        muted
        autoPlay
        controls={false}
        width="100%"
        height="80%"
      />
      {!videoActive && (
        <div className="absolute top-0 left-0 bg-lightGray h-full w-full flex items-center justify-center">
          <img
            className="h-[35%] max-h-[150px] w-auto rounded-full aspect-square object-cover"
            src={user?.profileImage}
            alt={user?.name}
          />
        </div>
      )}
    </Grid>
  );
}
