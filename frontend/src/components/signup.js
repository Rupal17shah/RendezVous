import "./signup.css";
import React, { useState, useEffect } from "react";
import Logo from "../Logo.png";
import label from "../label.png";
import GoogleButton from "react-google-button";
import Navbar from "./navbar";
import {
  registerWithEmailAndPassword,
  auth,
  signInWithGoogle,
} from "../firebase";
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
  IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Google from "@mui/icons-material/Google";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [Img, setImg] = useState(label);
  const [file, setFile] = useState(Logo);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showAlert, setAlert] = React.useState(false);
  const [user, loading, error] = useAuthState(auth);
  const onImageChange = (e) => {
    const [file] = e.target.files;
    setImg(URL.createObjectURL(file));
    setFile(file);
  };
  useEffect(() => {
    if (loading) return;
    if (user) {
      return navigate("/join");
    }
  }, [user, loading]);
  return (
    <>
      <Navbar />
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid item xs={12} sm={8} md={6} component={Paper} elevation={4}>
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            open={showAlert}
          >
            <Alert variant="filled" severity="error" elevation={10}>
              Email Address alredy exists! Login to your account
            </Alert>
          </Snackbar>
          <Box
            sx={{
              my: 8,
              mx: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5" sx={{ m: 1 }}>
              Register
            </Typography>
            <label htmlFor="upload-photo">
              <input
                style={{ display: "none" }}
                id="upload-photo"
                name="upload-photo"
                type="file"
                onClick={onImageChange}
              />
              <IconButton component="span">
                <Avatar
                  alt="Profile Picture"
                  src={Img}
                  sx={{
                    width: 80,
                    height: 80,
                    border: "0.1px solid lightgray",
                  }}
                />
              </IconButton>
            </label>
            <Typography variant="caption">Profile Photo</Typography>
            {/* <div className="picture">
              <img
                src={Img}
                className="picture-src"
                id="wizardPicturePreview"
                title=""
              />
              <input type="file" onChange={onImageChange} />
            </div> */}
            <Box component="form" sx={{ mt: 1 }} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Name"
                type="text"
                autoComplete="Name"
                autoFocus
                onChange={(e) => setName(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Confirm Password"
                type="password"
                autoComplete="current-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Grid
                container
                spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ p: 2 }}
              >
                <Grid item>
                  <Button
                    variant="contained"
                    onClick={() =>
                      registerWithEmailAndPassword(name, email, password, file)
                    }
                  >
                    Register
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    variant="contained"
                    startIcon={<Google />}
                    onClick={signInWithGoogle}
                  >
                    Sign in with Google
                  </Button>
                </Grid>
              </Grid>

              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ p: 2 }}
              >
                <Link href="/login" variant="body2">
                  {"Already have an account? Login"}
                </Link>
              </Grid>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={false}
          sm={4}
          md={6}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/RLw-UC03Gwc)",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#fefefe",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Grid>
    </>
  );
}
