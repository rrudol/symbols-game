function shuffle(a) {
  // for (let i = a.length - 1; i > 0; i--) {
  //   const j = Math.floor(Math.random() * (i + 1));
  //   [a[i], a[j]] = [a[j], a[i]];
  // }
  return a;
}

const colors = shuffle([
  "#7FDBFF", // AQUA
  '#2ECC40', // GREEN
  "#FFDC00", // YELLOW
  "#FF851B", // ORANGE
  "#FF4136", // RED
  '#B10DC9', // PURPLE
]);

const shapes = shuffle([
  0xf1fa, // at
  0xf188, // bug
  0xf058, // check circle
  0xf0e7, // bolt
  0xf02d, // book
  0xf0f3 // bell
]);

const getMixedIcons = (count, colorCount, shapeCount) => {
  const colorArray = colors;
  const shapeArray = shapes;
  console.log(colors, colorArray, shapeArray);
  return Array(count)
    .fill()
    .map(icon => {
      const colorNo = Math.floor(Math.random() * colorCount);
      const shapeNo = Math.floor(Math.random() * shapeCount);
      return { color: colorArray[colorNo], shape: shapeArray[shapeNo] };
    });
};

const normalizePosition = ({ x, y }) => {
  return {
    x: (window.window.innerWidth * x) / 113,
    y: (window.innerHeight * y) / 113
  };
};

const addIcon = (char, fill, rx, ry, cb) => {
  let style = new PIXI.TextStyle({
    fontFamily: "Font Awesome 5 Free",
    fontSize: Math.min(window.innerHeight, window.innerWidth) / 10,
    fill,
    stroke: "#354c57",
    strokeThickness: 4,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 0,
    dropShadowAngle: Math.PI / 6,
    dropShadowDistance: 1
  });

  let { x, y } = normalizePosition({ x: rx, y: ry });

  let message = new PIXI.Text(String.fromCharCode(char), style);
  message.interactive = true;
  message.x = x;
  message.y = y;

  message.on('pointerup', cb);

  return message;
};

class Game {
  constructor(pixi, io) {
    console.log('Game started!')
    if (!this.id) {
      this.id = Math.trunc(Math.random() * 1000000);
    }

    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight
    });

    this.app.renderer.backgroundColor = 0xf2e5bd;
    document.body.appendChild(this.app.view);

    this.score = 0;

    this.init(io, "http://192.168.1.3:3000");
    this.refresh();
  }

  init(io, url) {
    const socket = io(url);
    socket.on("connect", () => {
      console.log("connected");
      socket.emit("join", window.location.pathname);
    });

    socket.on("redirect", message => {
      console.log("redirected");
      window.location.pathname = `/${message}`;
    });

    socket.on("leaderboard", message => {
      this.leaderboard = message;
      console.log(message);
    });

    socket.on("ok", roomId => {
      socket.emit("start", { roomId: roomId || window.location.pathname, playerId: localStorage.getItem("id") });
    });

    socket.on("table", message => {
      console.log('table', {message});
      for (let i = this.app.stage.children.length - 1; i >= 0; i--) {
        this.app.stage.removeChild(this.app.stage.children[i]);
      }

      Object.values(message).forEach(i => {
        this.app.stage.addChild(
          addIcon(
            shapes[Math.trunc(i / 6)],
            colors[i % 6],
            10 + Math.random() * 80,
            10 + Math.random() * 50,
            () => {}
          )
        );
      });

      this.refresh();
    });

    socket.on("hand", message => {
      console.log('hand', {message});
      Object.values(message).forEach((i, n, a) => {
        this.app.stage.addChild(
          addIcon(
            shapes[Math.trunc(i / 6)],
            colors[i % 6],
            10 + n * 100/a.length,
            90,
            () => socket.emit('guess', i)
          )
        );
      });

      this.refresh();
    });

    socket.on("score", message => this.score = message[0]);

    socket.on("fail", _ => alert('Błąd!'));

    socket.on("disconnect", function() {});
  }

  get id() {
    return localStorage.getItem("id");
  }

  set id(i) {
    localStorage.setItem("id", i);
  }

  refresh() {
    this.addText(
      `Gracz ${this.id} | Wynik: ${this.score}`,
      5,
      5
    );

    if(this.leaderboard){
      const leaderboard = this.leaderboard.reduce((a,c,i)=>{ return a + `${c.id}: ${c.score}\n` },"");
      console.log(leaderboard);
      this.addText(
        `Tablica wyników:\n${leaderboard}` ,
        80,
        5
      );
    }
    

    this.addText(
      "Kliknij w symbol o tym samym kształcie i kolorze co któryś powyzej:",
      5,
      85
    );
  }

  addText(text, x, y) {
    let message = new PIXI.Text(text, {
      fontFamily: "Arial",
      fontSize: 16,
      fill: 0xff1010
    });
    const m = normalizePosition({ x, y });
    message.x = m.x;
    message.y = m.y;
    this.app.stage.addChild(message);
  }
}

define(() => Game);
