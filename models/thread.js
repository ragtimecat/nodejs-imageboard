const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const threadSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  boardId: {
    type: String,
    required: true,
    default: 1,
  }
}, { timestamps: true });

const Thread = mongoose.model('Thread', threadSchema);
module.exports = Thread;