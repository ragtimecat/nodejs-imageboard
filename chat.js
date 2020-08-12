const formatMessage = require('./utils/chatMessages');
// const chatAuth = require('./utils/chatAuth');
const socketio = require('socket.io');

module.exports = function (server, req, res) {
  const io = socketio(server);

  const botName = 'The Board Bot';
  // const username = `${user.name} ${user.surname}`;
  // console.log(chatAuth());

  io.on('connection', socket => {
    console.log('connected');
    // message for connecting user
    socket.emit('message', formatMessage(botName, `Welcome to the chat, user`));

    //message for everyone else in chat
    socket.broadcast.emit('message', formatMessage(botName, `A user has joined the chat`));

    socket.on('disconnect', () => {
      console.log('disconnected');
      io.emit('message', formatMessage('user', 'A user has left the chat'));
    })

    socket.on('chatMessage', message => {
      io.emit('message', formatMessage('user', message));
    });

  })
}

