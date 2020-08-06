const Message = require('../models/message');
const Thread = require('../models/thread');
const threadController = require('./threadController');
const path = require('path');
const Resize = require('../classes/Resize');


// get form for board creation
const get_messages_by_thread_id = async (id) => {
  return await Message.find({ threadId: id });
}

// create new message with "text" in thread "threadId"
const first_message_in_thread = async (thread, text) => {
  try {
    const message = new Message({ thread, text });
    const newMessage = await message.save();
    await Thread.findByIdAndUpdate(thread, { $addToSet: { messages: newMessage._id } });
    return { message: "Everything is okay" };
  } catch (err) {
    return { message: "Error happened somewhere" };
  }
}


// create new message 
const new_message_post = async (req, res) => {
  try {
    const replies = replies_parse(req.body.text);
    req.body.outgoingReplies = replies;
    req.body.text = wrapRepliesWithLinks(req.body.text);
    const picture_path = await upload_picture(req.file);
    if (picture_path !== null) {
      req.body.picture_path = picture_path;
    }
    const message = new Message(req.body);
    const newMessage = await message.save();

    if (typeof replies != 'undefined' && replies.length > 0) {
      replies.forEach(async reply => {
        await Message.findByIdAndUpdate(reply, { $addToSet: { incomingReplies: newMessage._id } });
      })
    }

    let thread = await Thread.find({ _id: req.body.thread }, { last_messages: 1 });
    // use [0] because by default result contains an array with single object inside
    thread = thread[0];
    if (typeof thread.last_messages != 'undefined' && thread.last_messages.length < 3) {
      await Thread.findByIdAndUpdate(req.body.thread,
        { $addToSet: { messages: newMessage._id, last_messages: newMessage._id } });
    } else if (typeof thread.last_messages != 'undefined' && thread.last_messages.length >= 3) {
      const last_messages = thread.last_messages;
      last_messages.shift();
      last_messages.push(newMessage._id);
      await Thread.findByIdAndUpdate(req.body.thread, { $addToSet: { messages: newMessage._id }, last_messages });
    }

    res.json(newMessage);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}


//delete message
const message_delete = async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.body.id);
    res.status(200).send({ payload: deletedMessage });
  } catch (err) {
    res.status(500).send({ 'error': err });
  }
}

// upload a picture linked to the post
const upload_picture = async (file) => {
  const imagePath = path.join(__dirname, '..', '/public/images');
  const fileUpload = new Resize(imagePath);
  if (!file) {
    // res.status(401).json({ error: 'Please provide an image' });
    return null;
  }
  const filename = await fileUpload.save(file.buffer);
  console.log(filename);
  return filename;
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