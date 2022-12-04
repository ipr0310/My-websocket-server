const express = require("express");
const WebSocket = require("ws");

const app = express();
const server = require("http").createServer(app);

const wss = new WebSocket.WebSocketServer({ server });

wss.on("connection", (ws) => {
  // New connection
  console.log("A new client has connected!");

  // Send message to client
  ws.send("Welcome New Client!");

  ws.on("message", (data, isBinary) => {
    console.log("received: %s", data);

    ws.send("Got your message its: " + data);

    // Broadcast message to every other connected WebSocket client
    wss.clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});

app.get("/", (req, res) => res.send("Hello world!"));

server.listen(3000);
