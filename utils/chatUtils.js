const moment = require('moment');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.json');
const chatUser = require('../models/chatUser');
const User = require('../models/user');


function formatMessage(username, message) {
  return {
    username,
    message,
    time: moment().format('h:mm a')
  }
}

function jwtCookieParse(cookie) {
  const regex = /token=[a-zA-Z0-9._-]*/;
  const match = cookie.match(regex);
  //match returns array of data, so we have to take first element of array
  //match will return token with "token=" start, so we cut first 6 chars
  return match[0].substr(6);

}

async function userJoin(socket, room) {
  const cookie = socket.client.request.headers.cookie;
  const token = jwtCookieParse(cookie);

  try {
    const decoded = jwt.verify(token, jwtConfig.jwtSecret);

    let user = await chatUser.findOne({ userId: decoded.user.id });

    if (!user) {
      user = await User.findById(decoded.user.id, { name: 1, surname: 1, role: 1 });
      //from mongoose to plain object
      user = user.toObject();
      user.nickname = `${user.name} ${user.surname}`;

      const newUser = new chatUser({ socketId: socket.id, userId: user._id, name: user.nickname, role: user.role, room });
      user = await newUser.save();
    }

    user = await chatUser.findOneAndUpdate({ userId: decoded.user.id }, { socketId: socket.id })
    return user;
  } catch (error) {
    console.log(error);
  }

}

async function getRoomUsers(room) {
  const users = await chatUser.find({ room }, { name: 1, role: 1 });
  return users;
}

async function userLeave(socketId) {
  const user = await chatUser.findOneAndDelete({ socketId }, { name: 1, room: 1 });
  return user;
}

async function getCurrentUser(socketId) {
  const user = await chatUser.findOne({ socketId }, { name: 1, room: 1 });
  return user;
}

module.exports = {
  formatMessage,
  jwtCookieParse,
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
}
