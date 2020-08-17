const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const charUserSchema = new Schema({
  socketId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  room: {
    type: String,
    require: true,
  },
  role: {
    type: String,
    required: true
  }
});

const ChatUser = mongoose.model('ChatUser', charUserSchema);
module.exports = ChatUser;