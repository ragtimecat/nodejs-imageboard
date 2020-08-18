const moment = require('moment');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.json');
const ChatUser = require('../models/chatUser');
const User = require('../models/user');
const ChatMessage = require('../models/chatMessages');
const ChatRoom = require('../models/chatRoom');


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

    let user = await ChatUser.findOne({ userId: decoded.user.id });

    if (!user) {
      user = await User.findById(decoded.user.id, { name: 1, surname: 1, role: 1 });
      //from mongoose to plain object
      user = user.toObject();
      user.nickname = `${user.name} ${user.surname}`;

      const newUser = new ChatUser({ socketId: socket.id, userId: user._id, name: user.nickname, role: user.role, room });
      user = await newUser.save();
    } else {
      //prob have to update socketid alongside with room
      user = await ChatUser.findOneAndUpdate({ userId: decoded.user.id }, { socketId: socket.id, room }, { returnOriginal: false });
    }
    return user;
  } catch (error) {
    console.log(error);
  }

}

async function getRoomUsers(room, io) {
  try {
    let sockets = io.sockets.adapter.rooms[room];
    sockets = Object.keys(sockets.sockets);
    const users = await ChatUser.find({ socketId: { $in: sockets } }, { name: 1, role: 1 });
    // const users = await ChatUser.find({ room }, { name: 1, role: 1 });
    return users;
  } catch (error) {
    console.log(error);
  }
}

async function userLeave(socketId) {
  const user = await ChatUser.findOneAndDelete({ socketId }, { name: 1, room: 1 });
  return user;
}

async function getCurrentUser(socketId) {
  const user = await ChatUser.findOne({ socketId }, { name: 1, room: 1 });
  return user;
}

async function saveMessage(message, username, room) {
  const targetRoom = await ChatRoom.findOne({ name: room }, { _id: 1 });
  if (!targetRoom) {
    return null;
  }
  const savedMessage = new ChatMessage({ message, username, room: targetRoom._id });
  const newMessage = await savedMessage.save();

  await ChatRoom.findOneAndUpdate({ name: room }, { $addToSet: { messages: newMessage._id } });
}

async function getLastMessages(room) {
  const targetRoom = await ChatRoom.findOne({ name: room }, { _id: 1 });
  let messages = await ChatMessage.find({ room: targetRoom._id }).sort({ createdAt: -1 }).limit(10);
  //mongoose will return last 10 messages sorted descending, so we have to reverse the result
  messages = messages.reverse();
  return messages;
}

module.exports = {
  formatMessage,
  jwtCookieParse,
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  saveMessage,
  getLastMessages
}
