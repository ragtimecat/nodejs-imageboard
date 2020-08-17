const User = require('../models/user');
const Room = require('../models/room');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt.json');

// functions

//logout
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
        role: user.role
      }
    }

    console.log(payload);
    jwt.sign(payload, jwtConfig.jwtSecret, {
      expiresIn: 360000,
    }, (err, token) => {
      if (err) throw err;
      res.cookie('token', token, {
        maxAge: '360000000',
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


//signup user with login, password and role params
const signup_post = async (req, res) => {
  const { login, password, name, surname, role } = req.body;
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
    const new_user = new User({ login, password: encrypted_password, name, surname, role });

    await new_user.save()

    const payload = {
      user: {
        id: new_user._id,
        role: new_user.role
      }
    }

    jwt.sign(payload, jwtConfig.jwtSecret, {
      expiresIn: 3600000,
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
  const { name, surname, role } = req.body;
  let id;
  if (typeof req.body.id !== 'undefined') {
    id = req.body.id;
  } else {
    id = req.user.id
  }
  try {
    const user = await User.findByIdAndUpdate(id, { name, surname, role });
    res.render('user-profile', { title: 'Profile Panel', user: { name, surname, role, ...user } });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
}

const staff_management_get = async (req, res) => {
  //get all user ids and names
  const users = await User.find().select({ _id: 1, name: 1 });
  //get first user
  const firstUser = await User.findOne().select({ _id: 1, name: 1, surname: 1, role: 1 });
  res.render('staff-management', { title: 'Staff management page', users, firstUser })
}

const staff_chat_get = async (req, res) => {
  const user = await User.findById(req.user.id, { name: 1, surname: 1 });
  const rooms = await Room.find();
  const defaultRoom = rooms.filter(room => room.default === true);
  res.render('staff-chat', { title: 'Chat', user, rooms, defaultRoom: defaultRoom[0] });
}


//get user by id
const user_get = async (req, res) => {
  const users = await User.findById(req.params.id, { password: 0, createdAt: 0, updatedAt: 0 });
  res.json(users);
}

//delete user
const user_delete = async (req, res) => {
  const id = req.params.id;
  const user = await User.findByIdAndDelete(id);
  res.json(user);
}

module.exports = {
  user_get,
  user_delete,
  auth_form_get,
  auth_post,
  signup_form_get,
  signup_post,
  auth_get,
  admin_panel_get,
  logout_get,
  user_profile_get,
  user_profile_post,
  staff_management_get,
  staff_chat_get
};