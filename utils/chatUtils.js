const moment = require('moment');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.json');
function formatMessage(username, message) {
  return {
    username,
    message,
    time: moment().format('h:mm a')
  }
}

function jwtCookieParse(cookie) {
  const regex = /token=[a-zA-Z0-9._]*/;
  const match = cookie.match(regex);
  //match returns array of data, so we have to take first element of array
  //match will return token with "token=" start, so we cut first 6 chars
  return match[0].substr(6);

}

function chatAuth(socket) {
  const cookie = socket.client.request.headers.cookie;
  const token = jwtCookieParse(cookie);

  const decoded = jwt.verify(token, jwtConfig.jwtSecret);
  return decoded;
}

module.exports = {
  formatMessage,
  jwtCookieParse,
  chatAuth
}
