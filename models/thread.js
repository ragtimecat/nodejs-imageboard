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
  board: {
    type: Schema.Types.ObjectId,
    ref: "Board"
  }
}, { timestamps: true });

const Thread = mongoose.model('Thread', threadSchema);
module.exports = Thread;