const socketio = require('socket.io');

module.exports = function (server) {
  const io = socketio(server);

  io.on('connection', socket => {
    socket.emit('message', 'Welcome to the chat');

    socket.on('chatMessage', message => {
      console.log(message);
      socket.emit('message', `${message} with love`);
    })
  })
}

