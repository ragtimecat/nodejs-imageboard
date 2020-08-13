const formatMessage = require('./utils/chatMessages');
const tokenPrase = require('./utils/chatJwtParse');
const express = require('express');
const jwt = require('jsonwebtoken');
const jwtConfig = require('./config/jwt.json');
const User = require('./models/user');

const socketio = require('socket.io');
// const chatAuth = require('./utils/chatAuth');

module.exports = function (server) {

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

    socket.on('chatMessage', async (message) => {
      const cookie = socket.client.request.headers.cookie;
      const token = tokenPrase(cookie);
      const decoded = jwt.verify(token, jwtConfig.jwtSecret);
      const user = await User.findById(decoded.user.id);

      io.emit('message', formatMessage(`${user.name} ${user.surname}`, message));
    });

  })
}

