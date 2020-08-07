const Thread = require('../models/thread');
const messageController = require('./messageController');
const Board = require('../models/board');

// get a form for thread creation with boardId as a parameter
const create_thread_get = (req, res) => {
  try {
    board = req.query.board;
    res.render('create-thread', { title: "Create a thread", board })
  } catch (err) {
    res.status(500).send(err.message);
  }
}


// create new thread
const create_thread_post = async (req, res) => {
  try {
    const thread = new Thread(req.body);
    const savedThread = await thread.save();
    Board.findByIdAndUpdate(req.body.board, { $addToSet: { threads: savedThread._Id } });
    messageController.first_message_in_thread(savedThread._id, req.body.text);
    return res.redirect(`/thread/${savedThread._id}`);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//get a single thread by id
const get_thread_by_id = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.id).populate('messages');
    return res.render('thread', { title: 'Imageboard', thread });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

//get all threads by board id
const get_threads_by_board_id = async (id) => {
  try {
    return await Thread.find({ boardId: id });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

const find_by_id_and_update = async (threadId, messageId) => {
  try {
    return await Thread.findByIdAndUpdate(threadId, { $addToSet: { messages: messageId } });
  } catch (err) {
    res.status(500).send(err.message);
  }
}

module.exports = {
  create_thread_get,
  create_thread_post,
  get_threads_by_board_id,
  get_thread_by_id,
  find_by_id_and_update
}