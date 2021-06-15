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

function logHeading(title) {
  console.log(`${'='.repeat(80)}`);
  console.log(`${title}`);
  console.log(`${'='.repeat(80)}`);
}

// Print the blockchain to the console
logHeading('Blockchain');
console.log(JSON.stringify(blockchain.chain, null, 2));

// Is the blockchain valid?
blockchain.isChainValid();

// Alter the data of one of the blocks
logHeading('Test 1: Altered Data');
blockchain.chain[1].data = { value: 'altered data' };

// Print the blockchain to the console
console.log(JSON.stringify(blockchain.chain, null, 2));

// Is the blockchain valid?
blockchain.isChainValid();

// Recalculate the hash of the block
logHeading('Test 2: Recalculated Hash');
blockchain.chain[1].hash = blockchain.chain[1].calculateHash();

// Print the blockchain to the console
console.log(JSON.stringify(blockchain.chain, null, 2));

// Is the blockchain valid?
blockchain.isChainValid();
