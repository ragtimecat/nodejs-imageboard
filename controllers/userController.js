const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.json');

// functions

const logout_get = (req, res) => {
  res.clearCookie('token');
  res.redirect(302, '/user/auth-form');
}

//get a login form
const auth_form_get = (req, res) => {
  const token = req.cookies.token;
  if (token) {
    res.redirect(302, '/user/admin-panel');
  }


  res.render('user-auth', { title: "auth" });
}

//get logged in user
const auth_get = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }

}

//login user with login and password params
const auth_post = async (req, res) => {
  const { login, password } = req.body;
  if (login == '') {
    return res.status(400).json({ msg: 'no login' });
  }
  if (password == '') {
    return res.status(400).json({ msg: 'no password' });
  }

  try {
    const user = await User.findOne({ login });
    if (!user) {
      return res.status(400).json({ msg: 'User with such login not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Creadentials' })
    }

    const payload = {
      user: {
        id: user._id,
        role: user.userType
      }
    }

    console.log(payload);
    jwt.sign(payload, jwtConfig.jwtSecret, {
      expiresIn: 360000,
    }, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, {
        maxAge: '60000000000',
        domain: 'localhost',
        httpOnly: false,
      });
      res.redirect(301, '/user/admin-panel');
    })

  } catch (err) {
    console.log(err.message);
    res.status(500).send(err.message);
  }
}

//get a registration form
const signup_form_get = (req, res) => {
  res.render('user-signup', { title: "signup" });
}


//signup user with login, password and userType params
const signup_post = async (req, res) => {
  const { login, password, userType } = req.body;
  if (login == '') {
    return res.status(400).json({ msg: 'no login' });
  }
  if (password == '') {
    return res.status(400).json({ msg: 'no password' });
  } else if (password.length < 5) {
    return res.status(400).json({ msg: 'password is too short' });
  }

  try {
    const user = await User.findOne({ login });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const encrypted_password = await bcrypt.hash(password, salt);
    const new_user = new User({ login, password: encrypted_password, userType });

    await new_user.save()

    const payload = {
      user: {
        id: new_user._id,
        role: new_user.userType
      }
    }

    jwt.sign(payload, jwtConfig.jwtSecret, {
      expiresIn: 360000,
    }, (err, token) => {
      if (err) {
        throw err;
      }
      res.json({ msg: 'User successfully created', token })
    })
  } catch (err) {
    console.log(err);
  }
}

//get an admin panel
const admin_panel_get = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select('-password');
    if (!user) {
      res.status(404).json({ msg: 'User not found' });
    }
    res.render('admin-panel', { title: 'Admin Panel', user });
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}


//get profile page
const user_profile_get = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select('-password');
    if (!user) {
      res.status(404).json({ msg: 'User not found' });
    }
    res.render('user-profile', { title: 'Profile Panel', user });
  } catch (err) {
    res.status(500).json({ msg: err.message })
  }
}

// update user profile
const user_profile_post = async (req, res) => {
  const { name, surname, userType } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { name, surname, userType });
    console.log('here' + user);
    res.render('user-profile', { title: 'Profile Panel', user: { name, surname, userType, ...user } });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}


module.exports = {
  auth_form_get,
  auth_post,
  signup_form_get,
  signup_post,
  auth_get,
  admin_panel_get,
  logout_get,
  user_profile_get,
  user_profile_post
};