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
      messageController.first_message_in_thread(result._id, req.body.text);
      res.redirect(`/thread/${result._id}`);
    })
    .catch(err => console.log(err));
}

//get a single thread by id
const get_thread_by_id = (req, res) => {

  Thread.findById(req.params.id).populate('messages')
    .then(result => res.render('thread', { title: "imageboard", thread: result }))
    .catch(err => console.log(err));
}

//get all threads by board id
const get_threads_by_board_id = (id) => {
  return Thread.find({ boardId: id }).exec();
}

const find_by_id_and_update = (threadId, messageId) => {
  return Thread.findByIdAndUpdate(threadId, { $addToSet: { messages: messageId } })
    .then(result => { return result })
    .catch(err => console.log(err));
}

const new_func = () => {
  return 4;
}

module.exports = {
  create_thread_get,
  create_thread_post,
  get_threads_by_board_id,
  get_thread_by_id,
  find_by_id_and_update,
  new_func
}