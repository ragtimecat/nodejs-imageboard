const jwt = require('jsonwebtoken');
const jwtConfig = require('./config/jwt.json');
const User = require('./models/user');
const { formatMessage, chatAuth } = require('./utils/chatUtils');

const socketio = require('socket.io');
// const chatAuth = require('./utils/chatAuth');

module.exports = function (server) {

  const io = socketio(server);



  const botName = 'The Board Bot';
  // const username = `${user.name} ${user.surname}`;
  // console.log(chatAuth());

  io.on('connection', async socket => {
    const decoded = chatAuth(socket);
    const user = await User.findById(decoded.user.id);
    user.nickname = `${user.name} ${user.surname}`;
    // message for connecting user
    socket.emit('message', formatMessage(botName, `Welcome to the chat, ${user.nickname}`));

    //message for everyone else in chat
    socket.broadcast.emit('message', formatMessage(botName, `A ${user.nickname} has joined the chat`));

    //message that user is online
    io.emit('userIsOnline', user.nickname);

    socket.on('disconnect', () => {
      console.log('disconnected');
      io.emit('message', formatMessage(botName, `A ${user.nickname} has left the chat`));
      io.emit('userIsOffline', user.nickname);
    })

    socket.on('chatMessage', async (message) => {


      io.emit('message', formatMessage(`${user.nickname}`, message));
    });

  })
}

