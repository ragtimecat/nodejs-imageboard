const Board = require('../models/board');

// get form for board creation
const create_board_get = (req, res) => {
  res.render('create-board', { title: "Create Board" });
}

// create new board
const create_board_post = (req, res) => {
  const board = new Board(req.body);
  board.save()
    .then(result => {
      res.redirect('/');
    })
    .catch(err => console.log(err));
}

// get existing board by id(name in future)
const board_details_get = (req, res) => {
  const id = req.params.id;
  Board.findById(id)
    .then(result => res.render('board', { board: result, threads: [] }))
    .catch(err => console.log(err));
}

module.exports = {
  create_board_get,
  create_board_post,
  board_details_get,
}