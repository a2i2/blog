let socketio = undefined;
let allTilesActive = false;
let deactivationTime = 1000;
let activeTiles = {};

const difficultySettings = {
  easy: {
    name: 'Easy',
    gridSize: 5,
    tileSize: 128
  },
  medium: {
    name: 'Medium',
    gridSize: 10,
    tileSize: 64
  },
  hard: {
    name: 'Hard',
    gridSize: 20,
    tileSize: 32
  }
};

let gameDifficulty = difficultySettings.easy;

const initialise = (io) => {
  socketio = io;

  setInterval(() => {
    deacivateTile();
  }, deactivationTime);
}

const run = (socket) => {
  // new socket connected, send active tiles and game difficulty
  socket.emit('activeTiles', activeTiles);
  socket.emit('setDifficultyLevels', difficultySettings);
  socket.emit('gameDifficulty', gameDifficulty);

  if (allTilesActive) {
    // game is already completed, notify new connection
    socket.emit('gameCompleted');
  }

  handleActivateTile(socket);
  handleAllTilesActive(socket);
  handleResetGame(socket);
}

const handleActivateTile = (socket) => {
  // listen for 'activateTile' events
  socket.on('activateTile', (tile) => {
    // attach a tile id
    const key = `${tile.x},${tile.y}`;
    tile.id = key;

    // add the tile to the active tile collection
    if (!activeTiles.hasOwnProperty(key)) {
      activeTiles[key] = tile;

      // send the activate tile to all connected sockets
      socketio.emit('activateTile', tile);
    }
  });
}

const handleAllTilesActive = (socket) => {
  // listen for 'allTilesActive' events
  socket.on('allTilesActive', (tileCount) => {
    if (allTilesActive) {
      return;
    }

    // count the number of active tiles
    const totalTiles = Object.keys(activeTiles).length;

    // compare the count of active tiles to the tile count received
    if (totalTiles === tileCount) {
      // complete the game
      socketio.emit('gameCompleted');
      allTilesActive = true;
    }
  });
}

const handleResetGame = (socket) => {
  // listen for 'resetGame' events
  socket.on('resetGame', (difficulty) => {
    resetGame(difficulty);
  });
}

const randomTile = () => {
  // find existing keys
  let keys = Object.keys(activeTiles);

  // get a random key
  const randomKey = keys[(keys.length * Math.random()) << 0];

  // return the random tile
  return activeTiles[randomKey];
}

const deacivateTile = () => {
  if (allTilesActive) {
    return;
  }

  // select a random tile
  let tile = randomTile();

  if (tile) {
    // deactivate the tile
    socketio.emit('deactivateTile', tile.id);
    delete activeTiles[tile.id];
  }
}

const resetGame = (difficulty) => {
  // reset all tiles
  allTilesActive = false;
  activeTiles = {};

  // set game difficulty
  gameDifficulty = difficultySettings[difficulty.toLowerCase()];
  socketio.emit('gameDifficulty', gameDifficulty);
  socketio.emit('resetGame');
}

// export these functions for external use
module.exports = { initialise, run };
