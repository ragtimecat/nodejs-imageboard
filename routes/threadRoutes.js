const express = require('express');
const threadController = require('../controllers/threadController');

const router = express.Router();

// get a form for thread creation with boardId as a parameter
router.get('/create', threadController.create_thread_get);

// create new thread
router.post('/create', threadController.create_thread_post);

//get single thread
router.get('/:id', threadController.get_thread_by_id);


module.exports = router;