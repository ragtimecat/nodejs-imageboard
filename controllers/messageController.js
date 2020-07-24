const Message = require('../models/message');

// get form for board creation
const get_messages_by_thread_id = (id) => {
  return Message.find({ threadId: id }).exec();
}

// create new message with "text" in thread "threadId"
const new_message_post = (threadId, text) => {
  const message = new Message({ threadId, text });
  message.save();
}

module.exports = {
  get_messages_by_thread_id,
  new_message_post
}