let socketio = undefined;

const chatHistory = [];
const userList = [];

const userTypingStatus = {};
const timers = {};
const typingStatusTime = 2000;

const id = {
  message: 0,
  user: 0,
  unique: {}
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
  handleTypingStatus(socket);
}

const handleUserConnected = (socket) => {
  // listen for 'userConnected' events
  socket.on('userConnected', (username) => {
    // create a new user object
    let newUser = {
      userID: getID('user'),
      uniqueID: getID('unique', username),
      name: username
    };

    // determine user unique name    
    newUser.uniqueName =
      newUser.uniqueID > 0 ?
        `${newUser.name}#${newUser.uniqueID}` :
        newUser.name;

    // add the user to the userList
    userList.push(newUser);

    // send a login event to this user
    socket.emit('userLogin', newUser);

    // create a new message about the connection
    let connectedMessage = {
      sender: 'Server',
      text: `${newUser.uniqueName} connected`,
      id: getID('message'),
      time: Date.now()
    };

    // add the message to the chatHistory
    chatHistory.push(connectedMessage);

    // send the user connection to all connected sockets
    socketio.emit('userConnected', newUser);
    socketio.emit('chatMessage', connectedMessage);
  });
}

const handleChatMessage = (socket) => {
  // listen for 'chatMessage' events
  socket.on('chatMessage', (chatMessage) => {
    // attach a message id and timestamp
    chatMessage.id = getID('message');
    chatMessage.time = Date.now();
    
    // add the message to the chat history
    chatHistory.push(chatMessage);

    // clear typing status for this user
    clearTypingStatus(chatMessage.sender.userID);

    // send the message to all connected sockets
    socketio.emit('chatMessage', chatMessage);
  });
}

const handleTypingStatus = (socket) => {
  // listen for 'setTypingStatus' events
  socket.on('setTypingStatus', (typingStatus) => {
    // set typing status to true for this user
    userTypingStatus[typingStatus.user.userID] = {
      user: typingStatus.user,
      typing: true
    };

    // set a timer to reset the typing status
    setStatusTimer(typingStatus.user.userID);

    // broadcast the typing status'
    socketio.emit('typingStatus', userTypingStatus);
  });
}

const clearTypingStatus = (userID) => {
  // set typing status to false for this user
  userTypingStatus[userID].typing = false;

  // if a timer exists for this user, remove it
  removeStatusTimer(userID);

  // broadcast the typing status'
  socketio.emit('typingStatus', userTypingStatus);
}

const removeStatusTimer = (userID) => {
  // if this user id is a key of timers, clear the timer
  if (timers.hasOwnProperty(userID)) {
    clearTimeout(timers[userID]);
  }
}

const setStatusTimer = (userID) => {
  // if a timer exists for this user, remove it
  removeStatusTimer(userID);

  // set a timer to clear the typing status
  timers[userID] = setTimeout(() => {
    userTypingStatus[userID].typing = false;

    // broadcast the typing status'
    socketio.emit('typingStatus', userTypingStatus);
  }, typingStatusTime);
}

const getID = (type, username = undefined) => {
  let newID;

  if (username) {
    if (!id[type].hasOwnProperty(username)) {
      // this is a new username
      newID = id[type][username] = 0;
    } else {
      // this is a duplicate username
      newID = id[type][username];
    }

    id[type][username] += 1;
  } else {
    // return the next id
    newID = id[type];
    id[type] += 1;
  }

  return newID;
}

// export these functions for external use
module.exports = { initialise, run };
