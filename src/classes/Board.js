function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // eslint-disable-line no-param-reassign
  }
  return array;
}

module.exports = class Board {
  constructor(size) {
    this.size = size;
    this.restart();
    setInterval(this.restart.bind(this), 10000)
  }
  has(t) {
    return this.symbols.includes(t);
  }
  restart() {
    this.symbols = shuffleArray( Array(30).fill().map((_, i) => i) ).slice(0, this.size);
    console.log(this.symbols);
  }
  toBuffer() {
    const arr = (new Uint8Array(this.size)).map( (_, i) => this.symbols[i] );
    return arr;
  }
}