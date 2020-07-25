const Board = require('../models/board');
const threadController = require('./threadController');

// get form for board creation
const create_board_get = (req, res) => {
  console.log(res.locals);
  res.render('create-board', { title: "Create Board" });
}

// create new board
const create_board_post = (req, res) => {
  Board.find({ name: req.body.name })
    .then(result => {
      if (result.length > 0) {
        res.render('create-board', { title: "error", message: "There is a board with such name already" })
        // throw new Error('there is a document with such name already');
      } else {
        const board = new Board(req.body);
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
const board_details_get = async (req, res) => {
  console.log(res.locals);
  const id = req.params.id;
  Board.findById(id).populate('threads')
    .then(result => {
      res.render('board', { title: "Imageboard", board: result })
    })
    .catch(err => console.log(err));
}

module.exports = {
  create_board_get,
  create_board_post,
  board_details_get,
}