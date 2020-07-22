const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const boardSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  section: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Board = mongoose.model('Board', boardSchema);
module.exports = Board;