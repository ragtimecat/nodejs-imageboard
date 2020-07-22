const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const Board = require('./models/board');
const db = require('./config/db-connect.json');

const app = express();

mongoose.connect(db.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
  Board.find()
    .then(result => res.render('index', { title: "main page", boards: result }))
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