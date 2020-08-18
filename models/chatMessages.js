const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatMessageSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'chatRoom',
    require: true
  }
  // userType: {
  //   type: String,
  //   required: true
  // }
}, { timestamps: true });


const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
module.exports = ChatMessage;