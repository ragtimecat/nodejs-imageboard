const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/logout', userController.logout_get);

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

// get user profile page
router.get('/profile', auth, userController.user_profile_get);

// update user rpofile
router.post('/profile', auth, userController.user_profile_post);

//get user management page
router.get('/management', auth, userController.stuff_management_get);

module.exports = router;