const Thread = require('../models/thread');
const messageController = require('./messageController');
const Board = require('../models/board');

// get a form for thread creation with boardId as a parameter
const create_thread_get = (req, res) => {
  board = req.query.board;
  res.render('create-thread', { title: "Create a thread", board })
}


// create new thread
const create_thread_post = (req, res) => {
  const thread = new Thread(req.body);
  thread.save()
    .then(result => {
      Board.findByIdAndUpdate(req.body.board, { $addToSet: { threads: result._id } })
        .then(
          result => { return result }
        )
        .catch(err => console.log(err));
      messageController.new_message_post(result._id, req.body.text);
      res.redirect(`/thread/${result._id}`);
    })
    .catch(err => console.log(err));
}

//get a single thread by id
const get_thread_by_id = (req, res) => {
  let messages = [];
  messageController.get_messages_by_thread_id(req.params.id)
    .then(result => (message = result));
  Thread.findById(req.params.id)
    .then(result => res.render('thread', { title: "imageboard", thread: result, messages }))
    .catch(err => console.log(err));
}

//get all threads by board id
const get_threads_by_board_id = (id) => {
  return Thread.find({ boardId: id }).exec();
}

module.exports = {
  create_thread_get,
  create_thread_post,
  get_threads_by_board_id,
  get_thread_by_id
}