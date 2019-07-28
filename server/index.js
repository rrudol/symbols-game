const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const Game = require("./classes/Game");

const path = require("path");
const Bundler = require("parcel-bundler");
const bundler = new Bundler(path.resolve(__dirname, "../web/index.html"));

app.use(bundler.middleware());

io.on("connection", socket => {
  socket.on("join", message => {
    if (message === "/") {
      socket.emit("redirect", Math.round((Math.random() * 1000000) % 1000000));
    } else {
      socket.emit("ok");
    }
  });

  socket.on("start", message => {
    const { playerId, roomId } = message;
    Game.join(roomId, playerId, socket);
  });

  console.log("a user connected", socket.id);
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
