const sha256 = require('js-sha256');
const { Challenge, Position } = require('./challenge');

class Block {
  constructor(index, timestamp, data, prev = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.prev = prev;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }
  
  calculateHash() {
    return sha256(
      this.index +
      this.timestamp +
      JSON.stringify(this.data) +
      this.prev +
      this.nonce
    );
  }

  mine(logNonce) {
    // Match hexadecimal 'abcd' at the end of the hash
    while (!Challenge.isSuccess(this.hash, 'abcd', Position.END)) {
      this.nonce++;
      this.hash = this.calculateHash();
      if (logNonce) console.log(`${this.nonce} - ${this.hash}`);
    }
  }
}

module.exports = Block;
