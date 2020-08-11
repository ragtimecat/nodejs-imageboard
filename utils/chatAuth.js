const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.json');


module.exports = function () {
  // const token = req.header('x-auth-token');
  const token = req.cookies.token;

  if (!token) {
    return res.render('404', { title: 'Error 404' });
    // return res.status(401).json({ msg: 'There is no token, auth denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.jwtSecret);
    return decoded.user;
  } catch (err) {
    return res.redirect(302, '/user/auth-form');
    // res.status(401).json({ msg: 'Token is not valid' });
  }
}
