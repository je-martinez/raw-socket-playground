const express = require("express");
const ws = require("ws");
const port = process.env.PORT ?? 5050;
const app = express();

// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({ noServer: true });
wsServer.on("connection", (socket) => {
  console.log("New Connection!");
  socket.on("message", (message) => console.log(message));
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(port);
server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});

console.log("APP RUNNING ON PORT:", port);
