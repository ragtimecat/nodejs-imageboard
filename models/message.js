const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  threadId: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;