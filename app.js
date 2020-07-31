const express = require('express');
const mongoose = require('mongoose');
const Board = require('./models/board');
const Thread = require('./models/thread');
const boardRoutes = require('./routes/boardRoutes');
const threadRoutes = require('./routes/threadRoutes');
const messageRoutes = require('./routes/messageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./config/db-connect.json');
const bodyParser = require('body-parser');

const upload = require('./middleware/fileUpload');

const app = express();

// db connect
mongoose.connect(db.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));


//static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

//view engine
app.set('view engine', 'ejs');

app.use(async (req, res, next) => {
  res.locals.boards = await Board.find();
  // Board.find()
  //   .then(result => {
  //     res.locals.boards = result;
  //   })
  //   .catch(err => console.log(err));
  next();
});

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

//thread routes
app.use('/thread', threadRoutes);

//message routes
app.use('/message', messageRoutes);

//admin routes
app.use('/admin', adminRoutes);



// 404
app.use('/', (req, res) => {
  res.render('404', { title: "Error 404" })
})