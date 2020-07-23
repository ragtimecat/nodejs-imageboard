const express = require('express');
const mongoose = require('mongoose');
const Board = require('./models/board');
const Thread = require('./models/thread');
const db = require('./config/db-connect.json');

const app = express();

// db connect
mongoose.connect(db.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));


//static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

//view engine
app.set('view engine', 'ejs');

//paths
app.get('/', (req, res) => {
  Board.find()
    .then(result => {
      res.render('index', { title: "main page", boards: result })
    })
    .catch(err => console.log(err));
})

app.get('/board/create', (req, res) => {
  res.render('create-board', { title: "Create Board" });
})

app.post('/board/create', (req, res) => {
  const board = new Board(req.body);
  board.save()
    .then(result => {
      res.redirect('/');
    })
    .catch(err => console.log(err));
})

app.get('/board/:id', (req, res) => {
  const id = req.params.id;
  Board.findById(id)
    .then(result => res.render('board', { board: result, blogs: [], threads: [] }))
    .catch(err => console.log(err));
})

app.get('/thread/create', (req, res) => {
  boardId = req.query.board;
  res.render('create-thread', { title: "Create a thread", boardId })
})

app.post('/thread/create', (req, res) => {
  const thread = new Thread(req.body);
  thread.save()
    .then(result => {
      console.log(result);
      res.redirect(`/thread/${result._id}`);
    })
    .catch(err => console.log(err));
})