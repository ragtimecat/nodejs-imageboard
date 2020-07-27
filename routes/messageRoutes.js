const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

// get form for board creation
router.post('/create', messageController.new_message_post);

//delete message
router.delete('/:id', messageController.message_delete);

module.exports = router;