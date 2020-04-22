const express = require('express');
const http = require('http').Server(express);
const socketio = require('socket.io')(http, { pingTimeout: 60000 });
const port = 3030;

socketio.on('connection', (socket) => {
  // new socket connected
  socket.on('message', (eventData) => {
    // attach the current time
    eventData.processed = Date.now();

    // send the message back to the client
    socket.emit('message', eventData);
  });
});

http.listen(port, () => {
  console.log('Server started on port', port);
});
