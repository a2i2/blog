let socketio = undefined;
const chatHistory = [];
const userList = [];
const id = {
  message: 0,
  user: 0
};

const initialise = (io) => {
  socketio = io;
}

const run = (socket) => {
  // new socket connected, send user list and chat history
  socket.emit('userList', userList);
  socket.emit('chatHistory', chatHistory);

  handleUserConnected(socket);
  handleChatMessage(socket);
}

const handleUserConnected = (socket) => {
  // listen for 'userConnected' events
  socket.on('userConnected', (username) => {
    // create a new user object
    let newUser = {
      id: getID('user'),
      name: username
    };

    // add the user to the user list
    userList.push(newUser);

    // create a new message about the connection
    let connectedMessage = {
      sender: 'Server',
      text: username + ' connected.',
      id: getID('message')
    };

    // add the message to the chat history
    chatHistory.push(connectedMessage);

    // send the user connection to all connected sockets
    socketio.emit('userConnected', newUser);
    socketio.emit('chatMessage', connectedMessage);
  });
}

const handleChatMessage = (socket) => {
  // listen for 'chatMessage' events
  socket.on('chatMessage', (chatMessage) => {
    // attach a message id
    chatMessage.id = getID('message');

    // add the message to the chat history
    chatHistory.push(chatMessage);

    // send the message to all connected sockets
    socketio.emit('chatMessage', chatMessage);
  });
}

const getID = (type) => {
  const newID = id[type];
  id[type] += 1;

  return newID;
}

// export these functions for external use
module.exports = { initialise, run };
