class Challenge {
  static set(phrase = 'aaaa', position = Position.START) {
    this.phrase = phrase;
    this.position = position;
  }

  static isSuccess(hash) {
    switch (this.position) {
      // The phrase is at the start of the hash
      case Position.START: {
        return hash.substring(0, this.phrase.length) === this.phrase;
      }
      // The phrase is at the end of the hash
      case Position.END: {
        const startIndex = hash.length - this.phrase.length;
        const endIndex = startIndex + this.phrase.length;
        return hash.substring(startIndex, endIndex) === this.phrase;
      }
      // The phrase is anywhere in the hash
      case Position.ANY: {
        return hash.includes(this.phrase);
      }
    }
  }
}

const Position = Object.freeze({
  START: 'START',
  END: 'END',
  ANY: 'ANY'
});

module.exports = { Challenge, Position };
