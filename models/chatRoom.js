const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  default: {
    type: Boolean,
    required: true
  },
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'chatMessage'
  }]
  // userType: {
  //   type: String,
  //   required: true
  // }
});

const ChatRoom = mongoose.model('ChatRoom', roomSchema);
module.exports = ChatRoom;