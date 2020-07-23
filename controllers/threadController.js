const Thread = require('../models/thread');

// get a form for thread creation with boardId as a parameter
const create_thread_get = (req, res) => {
  boardId = req.query.board;
  res.render('create-thread', { title: "Create a thread", boardId })
}

// create new thread
const create_thread_post = (req, res) => {
  const thread = new Thread(req.body);
  thread.save()
    .then(result => {
      console.log(result);
      res.redirect(`/thread/${result._id}`);
    })
    .catch(err => console.log(err));
}

const get_thread_by_id = (req, res) => {
  Thread.findById(req.params.id)
    .then(result => res.render('thread', { title: "imageboard", thread: result }))
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