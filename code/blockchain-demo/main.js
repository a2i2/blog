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

function logValidity() {
  const response = blockchain.isChainValid();
  const validity = `${response.isValid ? '' : 'NOT '}VALID`;
  const reason = `${!response.isValid ? ': ' : ''}${response.reason || ''}`;
  console.log(`\nThe blockchain is ${validity}${reason}\n`);
}

function logBlockchain() {
  console.log(JSON.stringify(blockchain.chain, null, 2));
}

function test(title, testFunction = () => {}) {
  testFunction();
  logHeading(title);
  logBlockchain();
  logValidity();
}

test('Blockchain');

test('Test 1: Altered Data', () => {
  blockchain.chain[1].data = { value: 'altered data' };
});

test('Test 2: Recalculated Hash', () => {
  blockchain.chain[1].hash = blockchain.chain[1].calculateHash();
});

test('Test 3: Proof of Work', () => {
  blockchain.chain[1].mine();
});

test('Test 4: Proof of Work for Entire Blockchain', () => {
  for (let i = 1; i <= numBlocks; ++i) {
    blockchain.chain[i].prev = blockchain.chain[i - 1].hash;
    blockchain.chain[i].hash = blockchain.chain[i].calculateHash();
    blockchain.chain[i].mine();
  }
});
