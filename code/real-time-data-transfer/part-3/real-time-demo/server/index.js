const express = require('express');
const http = require('http').Server(express);
const socketio = require('socket.io')(http, { pingTimeout: 60000 });
const chat = require('./chat');
const game = require('./game');
const port = 3030;

chat.initialise(socketio);
game.initialise(socketio);

socketio.on('connection', (socket) => {
  // new socket connected
  chat.run(socket);
  game.run(socket);
});

http.listen(port, () => {
  console.log('Server started on port', port);
});
