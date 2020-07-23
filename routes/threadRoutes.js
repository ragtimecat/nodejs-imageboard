const express = require('express');
const threadController = require('../controllers/threadController');

const router = express.Router();

// app.get('/thread/create', (req, res) => {
//   boardId = req.query.board;
//   res.render('create-thread', { title: "Create a thread", boardId })
// })

// app.post('/thread/create', (req, res) => {
//   const thread = new Thread(req.body);
//   thread.save()
//     .then(result => {
//       console.log(result);
//       res.redirect(`/thread/${result._id}`);
//     })
//     .catch(err => console.log(err));
// })

module.exports = router;