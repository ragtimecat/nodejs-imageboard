const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  section: {
    type: String,
    required: true
  },
  threads: [{
    type: Schema.Types.ObjectId,
    ref: "Thread"
  }]
}, { timestamps: true });

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;