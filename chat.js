const jwt = require('jsonwebtoken');
const jwtConfig = require('./config/jwt.json');
const User = require('./models/user');
const { formatMessage, userJoin, getRoomUsers, userLeave, getCurrentUser } = require('./utils/chatUtils');

const socketio = require('socket.io');
// const chatAuth = require('./utils/chatAuth');

module.exports = function (server) {

  const io = socketio(server);



  const botName = 'The Board Bot';
  // const username = `${user.name} ${user.surname}`;
  // console.log(chatAuth());

  io.on('connection', async socket => {
    socket.on('joinRoom', async room => {
      const user = await userJoin(socket, room);
      socket.join(user.room);

      socket.emit('message', formatMessage(botName, `Welcome to ${user.room}`));

      //message for everyone else in chat
      socket.broadcast.to(user.room).emit('message', formatMessage(botName, `A ${user.name} has joined ${user.room}`));

      //sends list of users
      const users = await getRoomUsers(user.room);
      io.to(user.room).emit('roomusers', users);
    })

    socket.on('disconnect', async () => {
      console.log('disconnected');

      const user = await userLeave(socket.id);

      if (user) {

        io.to(user.room).emit('message', formatMessage(botName, `A ${user.name} has left the chat`));
        const users = await getRoomUsers(user.room);
        io.to(user.room).emit('roomusers', users);
      }
      // io.emit('message', formatMessage(botName, `A ${user.nickname} has left the ${user.room}`));

    })

    socket.on('chatMessage', async (message) => {
      const user = await getCurrentUser(socket.id);
      io.to(user.room).emit('message', formatMessage(`${user.name}`, message));
    });

  })
}

