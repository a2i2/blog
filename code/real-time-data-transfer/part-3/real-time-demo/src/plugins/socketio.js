import io from 'socket.io-client';

let socket = undefined;
const localIP = 'localhost';
const networkIP = '0.0.0.0';
const port = 3030;
const networkConnection = false;

function initialiseSocket() {
  const url = networkConnection ?
    `http://${networkIP}:${port}` :
    `http://${localIP}:${port}`;
  
  socket = io(url);
}

export function addEventListener(event) {
  if (!socket) {
    initialiseSocket();
  }

  socket.on(event.type, event.callback);
}

export function sendEvent(event) {
  socket.emit(event.type, event.data);
}
