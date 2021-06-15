const Block = require('./block');
const { Challenge, Position } = require('./challenge');

class Blockchain {
  constructor(options) {
    this.logNonce = options.logNonce || false;
    this.logTimer = options.logTimer || false;
    this.chain = [this.createGenesisBlock()];
    Challenge.set('0000', Position.END);
  }

  createGenesisBlock() {
    return new Block(0, Date.now(), 'genesisBlock', null);
  }

  lastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    const startTime = Date.now();

    newBlock.prev = this.lastBlock().hash;
    newBlock.mine(this.logNonce);

    const timeTaken = Date.now() - startTime;
    const average = (
      Math.round(newBlock.nonce / timeTaken * 100) / 100
    ).toFixed(1);
    
    if (this.logTimer) {
      console.log(`\n>>> ${newBlock.hash} in ${timeTaken} ms`);
      console.log(`Averaged ${average} per millisecond\n`);
    }

    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; ++i) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      if (current.hash !== current.calculateHash()) return {
        isValid: false,
        reason: 'Data does not match hash'
      };
      
      if (!Challenge.isSuccess(current.hash)) return {
        isValid: false,
        reason: 'Hash failed challenge'
      };
      
      if (current.prev !== previous.hash) return {
        isValid: false,
        reason: 'Prev hash does not match',
      }
    }

    return { isValid: true };
  }
}

module.exports = Blockchain;
