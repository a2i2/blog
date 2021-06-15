const { Block, Blockchain } = require('./models');

// Create a new blockchain
const blockchain = new Blockchain({
  logNonce: false,
  logTimer: true
});

const numBlocks = 3;

// Add blocks to the blockchain
for (let i = 1; i <= numBlocks; ++i) {
  console.log(`Mining block ${i + 1}...`);
  blockchain.addBlock(new Block(
    i, Date.now(), { value: Math.random() }
  ));
}

// Print the blockchain to the console
console.log('blockchain:');
console.log(JSON.stringify(blockchain.chain, null, 2));

// Is the blockchain valid?
blockchain.isChainValid();

// Alter the data of one of the blocks
blockchain.chain[1].data = { value: Math.random() };

// Print the blockchain to the console
console.log(JSON.stringify(blockchain.chain, null, 2));

// Is the blockchain valid?
blockchain.isChainValid();

// Recalculate the hash of the block
blockchain.chain[1].hash = blockchain.chain[1].calculateHash();

// Print the blockchain to the console
console.log(JSON.stringify(blockchain.chain, null, 2));

// Is the blockchain valid?
blockchain.isChainValid();
