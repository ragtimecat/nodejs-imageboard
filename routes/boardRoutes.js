const express = require('express');
const boardController = require('../controllers/boardController');

const router = express.Router();

router.get('/create', boardController.create_board_get);

router.post('/create', boardController.create_board_post);

router.get('/:id', boardController.board_details_get)

module.exports = router;