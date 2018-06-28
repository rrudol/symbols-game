require([
  "Game",
  "https://cdnjs.cloudflare.com/ajax/libs/pixi.js/4.8.1/pixi.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.1.1/socket.io.js"
], (Game, pixi, io) => {
  new Game(pixi, io);
});
