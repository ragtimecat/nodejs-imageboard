const express = require('express');
const mongoose = require('mongoose');
const Board = require('./models/board');
const Thread = require('./models/thread');
const boardRoutes = require('./routes/boardRoutes');
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

//board routes
app.use('/board', boardRoutes);


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