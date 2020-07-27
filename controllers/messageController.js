const Message = require('../models/message');
const Thread = require('../models/thread');
const threadController = require('./threadController');

// get form for board creation
const get_messages_by_thread_id = (id) => {
  return Message.find({ threadId: id }).exec();
}

// create new message with "text" in thread "threadId"
const first_message_in_thread = (thread, text) => {
  const message = new Message({ thread, text });
  message.save()
    .then(result => {
      Thread.findByIdAndUpdate(thread, { $addToSet: { messages: result._id } })
        .then(result => { return result })
        .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
}

const new_message_post = (req, res) => {
  const message = new Message(req.body);
  message.save()
    .then(result => {
      Thread.findByIdAndUpdate(req.body.thread, { $addToSet: { messages: result._id } })
        .then(result => { return result })
        .catch(err => console.log(err));
      res.json(result);
    })
    .catch(err => console.log(err));
}

const message_delete = (req, res) => {
  console.log(req.body.id);
  Message.findByIdAndDelete(req.body.id)
    .then(result => {
      console.log(result);
      res.send({ 'success': true });
    })
    .catch(err => console.log(err));
}

module.exports = {
  get_messages_by_thread_id,
  first_message_in_thread,
  new_message_post,
  message_delete
}