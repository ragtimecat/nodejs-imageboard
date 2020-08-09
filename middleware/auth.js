const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.json');


module.exports = function (req, res, next) {
  // const token = req.header('x-auth-token');
  const token = req.cookies.token;

  if (!token) {
    return res.render('404', { title: 'Error 404' });
    // return res.status(401).json({ msg: 'There is no token, auth denied' });
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.redirect(302, '/user/auth-form');
    // res.status(401).json({ msg: 'Token is not valid' });
  }
}

// module.exports = function (roles = []) {
//   return function (req, res, next) {
//     const token = req.cookies.token;
//     if (!token) {
//       return res.render('404', { title: 'Error 404' });
//       // return res.status(401).json({ msg: 'There is no token, auth denied' });
//     }

//     try {
//       const decoded = jwt.verify(token, jwtConfig.jwtSecret);
//       req.user = decoded.user;
//       if (roles.length && !roles.includes(req.user.role)) {
//         return res.status(401).json({ msg: 'Unauthorized' });
//       }

//       next();
//     } catch (err) {
//       console.log(err.message);
//       return res.redirect(302, '/user/auth-form');
//       // res.status(401).json({ msg: 'Token is not valid' });
//     }
//   }
// }

//   const token = req.cookies.token;

//   if (!token) {
//     return res.render('404', { title: 'Error 404' });
//     // return res.status(401).json({ msg: 'There is no token, auth denied' });
//   }

//   try {
//     const decoded = jwt.verify(token, jwtConfig.jwtSecret);
//     req.user = decoded.user;
//     next();
//   } catch (err) {
//     return res.redirect(302, '/user/auth-form');
//     // res.status(401).json({ msg: 'Token is not valid' });
//   }
// }