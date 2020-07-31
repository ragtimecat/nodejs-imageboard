const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  thread: {
    type: Schema.Types.ObjectId,
    ref: "Thread"
  },
  picture_path: {
    type: String
  },
  outgoingReplies: [{
    type: String
  }],
  incomingReplies: [{
    type: String
  }]
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;