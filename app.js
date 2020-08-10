const express = require('express');
const mongoose = require('mongoose');
const Board = require('./models/board');
const Thread = require('./models/thread');
const boardRoutes = require('./routes/boardRoutes');
const threadRoutes = require('./routes/threadRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const db = require('./config/db-connect.json');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const http = require('http');
const chat = require('./chat');

const upload = require('./middleware/fileUpload');

// const app = express();
const app = express();
const server = http.createServer(app);

// db connect
mongoose.connect(db.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => server.listen(3000))
  .catch(err => console.log(err));

//static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

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

//socketio chat
chat(server);

//paths
app.get('/', async (req, res) => {
  try {
    const boards = await Board.find();
    res.render('index', { title: "main page", boards });
  } catch (err) {
    res.status(500).send(err.message);
  }
})
//admin routes
app.use('/user', userRoutes);

//board routes
app.use('/board', boardRoutes);

//thread routes
app.use('/thread', threadRoutes);

//message routes
app.use('/message', messageRoutes);

// 404
app.use('/', (req, res) => {
  res.render('404', { title: "Error 404" })
})