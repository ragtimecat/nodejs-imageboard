const express = require('express');
const boardController = require('../controllers/boardController');

const router = express.Router();

// get form for board creation
router.get('/create', boardController.create_board_get);

// create new board
router.post('/create', boardController.create_board_post);

// get existing board by id(name in future)
router.get('/:id', boardController.board_details_get)

module.exports = router;