class Challenge {
  static isSuccess(hash, phrase = 'aaaa', position = Position.START) {
    switch (position) {
      // The phrase is at the start of the hash
      case Position.START: {
        return hash.substring(0, phrase.length) === phrase;
      }
      // The phrase is at the end of the hash
      case Position.END: {
        const startIndex = hash.length - phrase.length;
        const endIndex = startIndex + phrase.length;
        return hash.substring(startIndex, endIndex) === phrase;
      }
      // The phrase is anywhere in the hash
      case Position.ANY: {
        return hash.includes(phrase);
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
