const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  login: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  surname: {
    type: String
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;