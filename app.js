var express = require('express');
var path = require('path');
var compression = require('compression');
var load = require('dotenv');
var cors = require('cors');
var DBConnection = require('./db/DBConnection');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

load.config();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var articlesRouter = require('./routes/articles');
var loginRouter = require('./routes/login');


DBConnection(process.env.MONGODB_URL)
  .then(() => console.log('Connection ok'))
  .catch(error => console.log('Connection to MongoDB failed'));

var app = express();

app.set('env', 'production');

app.use(logger('dev'));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/static', express.static(path.join(__dirname + '/client/build', 'static')));
app.use(cors());
app.use(function (errors, request, response, next) {
  response.json({errors: errors});
});

app.use('/', indexRouter);
app.use('/server/users', usersRouter);
app.use('/server/articles', articlesRouter);
app.use('/server/login', loginRouter);

app.get('*', (request, response) => {response.sendFile(path.join(__dirname, 'client/build/index.html'))});

module.exports = app;
