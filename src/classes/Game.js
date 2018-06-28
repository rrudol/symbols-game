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
    Object.values( this.players ).forEach((player) => {
      player.socket.emit('table', this.board.toBuffer());
      this.players[player.socket.id].board = new Board(6);
      player.socket.emit('hand', this.players[player.socket.id].board.toBuffer());
      this.sendScore(player);
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
    console.log(`refreshing board ${this.board.toBuffer()}`);

    this.broadcast();

    this.timeout = setTimeout( this.refresh.bind(this), 10000 );
  }
  addPlayer(playerId, socket) {
    this.score[playerId] = 0;
    this.players[socket.id] = {
      playerId,
      hand: new Board(4),
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