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
  }
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;