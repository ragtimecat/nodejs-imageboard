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
  }
  // userType: {
  //   type: String,
  //   required: true
  // }
});

const Room = mongoose.model('Room', roomSchema);
module.exports = Room;