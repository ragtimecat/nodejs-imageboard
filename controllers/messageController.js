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


// create new message 
const new_message_post = (req, res) => {
  const replies = replies_parse(req.body.text);
  console.log('replies' + replies);
  req.body.outgoingReplies = replies;
  req.body.text = wrapRepliesWithLinks(req.body.text);
  const message = new Message(req.body);
  message.save()
    .then(result => {
      if (typeof replies != 'undefined' && replies.length > 0) {
        replies.forEach(reply => {
          Message.findByIdAndUpdate(reply, { $addToSet: { incomingReplies: result._id } })
            .then(result => { return result })
            .catch(err => console.log(err));
        })
      }
      Thread.findByIdAndUpdate(req.body.thread, { $addToSet: { messages: result._id } })
        .then(result => { return result })
        .catch(err => console.log(err));
      console.log(result);
      res.json(result);
    })
    .catch(err => console.log(err));
}


//delete message
const message_delete = (req, res) => {
  Message.findByIdAndDelete(req.body.id)
    .then(result => {
      console.log(result);
      res.status(200).send({ payload: result });
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({ 'error': err });
    });
}

const wrapRepliesWithLinks = (text) => {
  text = text.replace(/>>[0-9a-z]*/gm, (match) => {
    resultLink = match.replace(/>>/, '');
    newLink = `<a href="#${resultLink}">${match}</a>`;
    return newLink;
  });
  return text;
}

//
const replies_parse = (text) => {
  const regExp = />>[0-9a-z]*/gm;
  resultArray = text.match(regExp);
  if (resultArray !== null) {
    resultArray.forEach((reply, i, arr) => {
      arr[i] = arr[i].replace(/>>/g, '');
      // arr[i] = Buffer.from(arr[i], 'utf-8');
    });
    console.log(resultArray);
    return resultArray;
  } else {
    return [];
  }
}

module.exports = {
  get_messages_by_thread_id,
  first_message_in_thread,
  new_message_post,
  message_delete
}