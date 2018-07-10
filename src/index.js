const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Game = require('./classes/Game');

app.use(express.static('public'));

app.get('/*', (req, res) => res.sendFile("index.html", {"root": __dirname+'/../public'}));

io.on('connection', (socket) => {
  socket.on('join', (message) => {
    if(message === '/') {
      socket.emit('redirect', 1);
    } else {
      socket.emit('ok');
    }
  });

  socket.on('start', message => {
    const { playerId, roomId } = message;
    Game.join(roomId, playerId, socket);
  });
  
  console.log('a user connected', socket.id);
});

http.listen(3187, () => {
  console.log('listening on *:3187');
});