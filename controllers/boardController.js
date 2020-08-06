const Board = require('../models/board');

// get form for board creation
const create_board_get = (req, res) => {
  res.render('create-board', { title: "Create Board" });
}

// create new board
const create_board_post = async (req, res) => {
  const isExist = await Board.findOne({ name: req.body.name });

  if (isExist) {
    return res.render('create-board', { title: "error", message: "There is a board with such name already" });
  }
  try {
    const board = new Board(req.body);
    const createdBoard = await board.save();
    return res.redirect(301, `/board/${createdBoard._id}`);
  } catch (err) {
    return res.sendStatus(500);
  }
}

// get existing board by id(name in future)
const board_details_get = async (req, res) => {
  try {
    const id = req.params.id;
    const board = await Board.findById(id).populate({
      path: 'threads',
      populate: {
        path: 'last_messages'
      }
    });
    return res.render('board', { title: 'Imageboard', board });
  } catch (err) {
    return res.render('404', { title: 'Error', message: 'Page not found' });
  }

}

module.exports = {
  create_board_get,
  create_board_post,
  board_details_get,
}