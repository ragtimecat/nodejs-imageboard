const express = require('express');
const messageController = require('../controllers/messageController');
const upload = require('../middleware/fileUpload');

const router = express.Router();

// create new message
router.post('/create', upload.single('image'), messageController.new_message_post);

//delete message
router.delete('/:id', messageController.message_delete);

module.exports = router;