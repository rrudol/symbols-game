# symbols-game

Real time multiplayer game inspired by [Dooble](https://rulesofplay.co.uk/products/dobble) board game. Made using WebSockets and Canvas.

## How to play
Go to [symbols.rudol.pl](http://symbols.rudol.pl/) (it may take a while till server wake up). New room will be generated. Room number will be visible in URL. Share URL with friends to invite them.

## How to run locally
Install dependencies
```
npm install
```

Uncomment line in `Game.js` file and set there your local IP
```
this.init(io, "http://192.168.1.3:3000");// - for local development
```

Start server and client
```
npm start
```

## Screenshot

![https://github.com/rrudol/symbols-game/blob/master/Screenshot.png?raw=true](https://github.com/rrudol/symbols-game/blob/master/Screenshot.png?raw=true)
