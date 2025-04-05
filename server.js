const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let locations = [];

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("sendLocation", (data) => {
    const { x, y } = data;
    if (x === undefined || y === undefined) {
      socket.emit("locationError", { error: "x and y are required" });
      return;
    }

    console.log(`Received location: x=${x}, y=${y}`);

    const newLocation = { x, y, timestamp: new Date().toISOString() };
    locations.push(newLocation);

    socket.emit("locationSaved", { success: true, location: newLocation });

    socket.broadcast.emit("newLocation", newLocation);
  });

  socket.on("getLatestLocation", () => {
    const latestLocation = locations[locations.length - 1] || null;
    socket.emit("latestLocation", { success: true, location: latestLocation });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
