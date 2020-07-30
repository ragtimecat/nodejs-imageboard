const Admin = require('../models/Admin');

// functions
const login_get = (req, res) => {
  res.render('admin-login', { title: "Login" });
}

module.exports = {
  login_get,
};