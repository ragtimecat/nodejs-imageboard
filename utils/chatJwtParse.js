
module.exports = function (cookie) {
  const regex = /token=[a-zA-Z0-9._]*/;
  const match = cookie.match(regex);
  //match returns array of data, so we have to take first element of array
  //match will return token with "token=" start, so we cut first 6 chars
  return match[0].substr(6);

}