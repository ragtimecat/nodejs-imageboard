const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

// get an admin panel
router.get('/admin-panel', auth, userController.admin_panel_get);

//get a login form
router.get('/auth-form', userController.auth_form_get);

//get logged in user
router.get('/auth', auth, userController.auth_get);

//login user
router.post('/auth', userController.auth_post);

//get a registration form(will remove later and itregrate form in admin panel)
router.get('/signup-form', userController.signup_form_get);

//new user sign up
router.post('/signup', userController.signup_post);

module.exports = router;