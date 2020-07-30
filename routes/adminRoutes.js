const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/login', adminController.login_get);

module.exports = router;