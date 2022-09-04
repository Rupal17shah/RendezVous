import "./login.css";
import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Google from "@mui/icons-material/Google";
import { auth, signInWithGoogle, logInWithEmailAndPassword } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const [showAlert, setAlert] = React.useState(false);
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
              Email Address or Password Incorrect! Try Again
            </Alert>
          </Snackbar>
          <Box
            sx={{
              my: 12,
              mx: 6,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                autoComplete="email"
                autoFocus
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
                    onClick={() => logInWithEmailAndPassword(email, password)}
                  >
                    Login
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
                spacing={2}
                direction="row"
                justifyContent="center"
                alignItems="center"
                sx={{ p: 1 }}
              >
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Register"}
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
            backgroundImage: "url(https://source.unsplash.com/smgTvepind4)",
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
