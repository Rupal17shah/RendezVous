const express = require("express");
const http = require("http");
var cors = require("cors");

const app = express();
const server = http.createServer(app);

const socket = require("socket.io");
const io = require("socket.io")(server, {
  cors: {
    origin: process.env.ORIGIN || "*",
  },
});

const users = {};

const PORT = process.env.PORT || 5000;

const socketRoom = {};

io.on("connection", (socket) => {
  socket.on("join-call", (roomId, user) => {
    if (users[roomId]) {
      users[roomId].push({ userId: socket.id, user });
    } else {
      users[roomId] = [{ userId: socket.id, user }];
    }
    socketRoom[socket.id] = roomId;
    const usersInRoom = users[roomId].filter(
      (user) => user.userId !== socket.id
    );
    socket.emit("all-users", usersInRoom);
  });
  socket.on("sending signal", (payload) => {
    io.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
      user: payload.user,
    });
  });
  socket.on("returning signal", (payload) => {
    io.to(payload.callerID).emit("receiving return", {
      signal: payload.signal,
      id: socket.id,
    });
  });
  socket.io("send message", (payload) => {
    io.emit("message", payload);
  });
  socket.io("disconnect", () => {
    const roomId = socketRoom[socket.id];
    let room = users[roomId];
    if (room) {
      room = room.filter((item) => item.userId !== socket.id);
      users[roomId] = room;
    }
    socket.broadcast.emit("user-left", socket.id);
  });
});

server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
