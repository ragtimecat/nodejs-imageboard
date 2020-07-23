const Board = require('../models/board');

// get form for board creation
const create_board_get = (req, res) => {
  res.render('create-board', { title: "Create Board" });
}

// create new board
const create_board_post = (req, res) => {
  const board = new Board(req.body);
  Board.find({ name: req.body.name })
    .then(result => {
      if (result.length > 0) {
        res.render('create-board', { title: "error", message: "There is a board with such name already" })
        // throw new Error('there is a document with such name already');
      } else {
        board.save()
          .then(result => {
            res.redirect('/');
          })
          .catch(err => console.log(err));
      }
    })
    .catch(err => console.log(err));

}

// get existing board by id(name in future)
const board_details_get = (req, res) => {
  const id = req.params.id;
  Board.findById(id)
    .then(result => res.render('board', { title: "Imageboard", board: result, threads: [] }))
    .catch(err => console.log(err));
}

module.exports = {
  create_board_get,
  create_board_post,
  board_details_get,
}