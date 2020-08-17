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
    let user = await User.findById(decoded.user.id, { name: 1, surname: 1, userType: 1 });
    //user is mongoose object by default
    user = user.toObject();
    user.nickname = `${user.name} ${user.surname}`;

    socket.on('joinRoom', room => {
      socket.leave(user.room);
      socket.join(room);
      user.room = room;
      console.log(user);

      socket.emit('message', formatMessage(botName, `Welcome to ${user.room}`));

      //message for everyone else in chat
      socket.broadcast.to(user.room).emit('message', formatMessage(botName, `A ${user.nickname} has joined the ${user.room}`));

      //finish join room mechanism

    })




    //message that user is online
    io.emit('userIsOnline', user.nickname);

    socket.on('disconnect', () => {
      console.log('disconnected');
      io.emit('message', formatMessage(botName, `A ${user.nickname} has left the ${user.room}`));
      io.emit('userIsOffline', user.nickname);
    })



    socket.on('chatMessage', async (message) => {
      io.to(user.room).emit('message', formatMessage(`${user.nickname}`, message));
    });

  })
}

