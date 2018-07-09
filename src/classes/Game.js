const Board = require('./Board');

const games = {};

module.exports = class Game {
  constructor() {
    this.players = {};
    this.score = [];
    this.board = new Board(7);
    this.timeout = setTimeout( this.refresh.bind(this), 10000 );
    console.log(`game created`);
  }
  broadcast() {
    const leader = Object.values( this.players ).map((player) => {
      return { id: player.playerId, score: this.score[player.playerId] };
    });
    Object.values( this.players ).forEach((player) => {
      this.sendScore(player);
      player.socket.emit('leaderboard', leader);
      player.socket.emit('table', this.board.toBuffer());
      this.players[player.socket.id].board = new Board(6);
      player.socket.emit('hand', this.players[player.socket.id].board.toBuffer());
    });
  }
  sendScore(player) {
    const t = new Uint8Array(1);
    t[0] = this.score[player.playerId];
    player.socket.emit('score', t);
  }
  refresh() {
    clearTimeout(this.timeout);

    this.board = new Board(7);
    // console.log(`refreshing board ${this.board.toBuffer()}`);

    this.broadcast();

    this.timeout = setTimeout( this.refresh.bind(this), 10000 );
  }
  addPlayer(playerId, socket) {
    console.log('new player', playerId)
    this.score[playerId] = this.score[playerId] || 0;
    this.players[socket.id] = {
      playerId,
      socket
    }

    socket.on('guess', message => {
      console.log(message, this.board.symbols);
      if(this.board.has(message)) {
        this.score[playerId] += 1;
        this.refresh();
      } else {
        socket.emit('fail');
      }
    });
    socket.on('disconnect', () => {
      delete this.players[socket.id];
    })
  }
  static join(roomId, playerId, socket) {
    if(!games[roomId]) {
      games[roomId] = new Game();
    }
    games[roomId].addPlayer(playerId, socket);
  }
}