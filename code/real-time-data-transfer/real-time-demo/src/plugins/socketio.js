import io from 'socket.io-client';

let socket = undefined;
const listeners = [];
const localIP = 'localhost';
const networkIP = '0.0.0.0';
const port = 3030;

// true: connect to localhost
// false: connect to network
const localConnection = true;

function initialiseSocket() {
  if (!socket) {
    const url = localConnection ?
      'http://' + localIP + ':' + port :
      'http://' + networkIP + ':' + port;

    socket = io(url);
  }
}

export function addEventListener(event) {
  initialiseSocket();

  if (!listeners.includes(event.type)) {
    socket.on(event.type, event.callback);
    listeners.push(event.type);
  }
}

export function sendEvent(event) {
  if (event.hasOwnProperty('data')) {
    socket.emit(event.type, event.data);
    return;
  }

  socket.emit(event.type);
}
